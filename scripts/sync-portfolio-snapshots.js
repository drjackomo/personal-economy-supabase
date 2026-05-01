import "dotenv/config";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";

const BATCH_SIZE = 500;
const MAX_REPORTED_ERRORS = 10;

const COLUMN_ALIASES = {
  snapshot_date: ["snapshot_date", "date", "data"],
  dossier_id: ["dossier_id", "account_id", "dossier", "account"],
  isin: ["isin"],
  asset_name: ["asset_name", "assetname", "asset", "name", "nome", "titolo"],
  market_value: ["market_value", "value", "total_value", "total", "valore", "amount"],
  note: ["note", "notes", "nota"],
};

const { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Errore: configura SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nel file .env");
  process.exit(1);
}

const csvPathArg = process.argv[2];

if (!csvPathArg) {
  console.error("Uso: npm run sync:portfolio -- ./exports/portfolio_snapshots.csv");
  process.exit(1);
}

const csvPath = resolve(process.cwd(), csvPathArg);

if (!existsSync(csvPath)) {
  console.error(`Errore: file CSV non trovato: ${csvPath}`);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const csvContent = readFileSync(csvPath, "utf8");

let rows;

try {
  rows = parse(csvContent, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
    trim: false,
  });
} catch (error) {
  console.error("Errore parsing CSV:", error.message);
  process.exit(1);
}

const discardedRows = [];
const validRows = [];

for (const [index, row] of rows.entries()) {
  const rowNumber = index + 2;
  const mappedRow = mapCsvRow(row);
  const normalizedRow = normalizeRow(mappedRow);

  if (normalizedRow.errors.length > 0) {
    addDiscard(discardedRows, rowNumber, normalizedRow.errors.join("; "));
    continue;
  }

  validRows.push(normalizedRow.value);
}

let upsertedRows = 0;

for (let index = 0; index < validRows.length; index += BATCH_SIZE) {
  const batch = validRows.slice(index, index + BATCH_SIZE);
  const { error } = await supabase.from("portfolio_snapshots").upsert(batch, {
    onConflict: "snapshot_date,dossier_id,isin",
  });

  if (error) {
    console.error(`Errore upsert batch ${Math.floor(index / BATCH_SIZE) + 1}:`, error.message);
    process.exit(1);
  }

  upsertedRows += batch.length;
}

console.log("Sync portfolio_snapshots completata");
console.log(`Righe lette: ${rows.length}`);
console.log(`Righe valide: ${validRows.length}`);
console.log(`Righe scartate: ${discardedRows.length}`);
console.log(`Righe upsertate: ${upsertedRows}`);

if (discardedRows.length > 0) {
  console.log(`Primi ${Math.min(MAX_REPORTED_ERRORS, discardedRows.length)} errori/scarti:`);
  for (const discardedRow of discardedRows.slice(0, MAX_REPORTED_ERRORS)) {
    console.log(`- Riga ${discardedRow.rowNumber}: ${discardedRow.reason}`);
  }
}

function mapCsvRow(row) {
  const normalizedEntries = new Map();

  for (const [header, value] of Object.entries(row)) {
    normalizedEntries.set(normalizeHeader(header), value);
  }

  return Object.fromEntries(
    Object.entries(COLUMN_ALIASES).map(([targetColumn, aliases]) => [
      targetColumn,
      findFirstValue(normalizedEntries, aliases),
    ]),
  );
}

function findFirstValue(normalizedEntries, aliases) {
  for (const alias of aliases) {
    const value = normalizedEntries.get(normalizeHeader(alias));
    if (value !== undefined && String(value).trim() !== "") {
      return value;
    }
  }

  return "";
}

function normalizeHeader(header) {
  return String(header ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeRow(row) {
  const errors = [];
  const snapshotDate = parseDate(row.snapshot_date);
  const dossierId = cleanUpper(row.dossier_id);
  const isin = cleanUpper(row.isin);
  const marketValue = parseMarketValue(row.market_value);

  if (!snapshotDate) {
    errors.push("snapshot_date mancante o non valida");
  }

  if (!dossierId) {
    errors.push("dossier_id mancante");
  }

  if (!isin) {
    errors.push("isin mancante");
  }

  if (marketValue === null) {
    errors.push("market_value mancante o non valido");
  }

  return {
    errors,
    value: {
      snapshot_date: snapshotDate,
      dossier_id: dossierId,
      isin,
      asset_name: cleanText(row.asset_name),
      market_value: marketValue,
      note: cleanText(row.note),
    },
  };
}

function parseDate(value) {
  const text = cleanText(value);

  if (!text) {
    return null;
  }

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return buildDate(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]));
  }

  const italianMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (italianMatch) {
    return buildDate(Number(italianMatch[3]), Number(italianMatch[2]), Number(italianMatch[1]));
  }

  const serialNumber = Number(text.replace(",", "."));
  if (Number.isFinite(serialNumber) && serialNumber > 0) {
    return parseSpreadsheetSerialDate(serialNumber);
  }

  return null;
}

function buildDate(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function parseSpreadsheetSerialDate(serialNumber) {
  const wholeDays = Math.floor(serialNumber);
  const excelEpoch = Date.UTC(1899, 11, 30);
  const date = new Date(excelEpoch + wholeDays * 86400000);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function parseMarketValue(value) {
  let text = cleanText(value);

  if (!text) {
    return null;
  }

  text = text
    .replace(/\s/g, "")
    .replace(/[€$£]/g, "")
    .replace(/[^\d,.-]/g, "");

  if (!text || text === "-" || text === "." || text === ",") {
    return null;
  }

  const commaIndex = text.lastIndexOf(",");
  const dotIndex = text.lastIndexOf(".");

  if (commaIndex !== -1 && dotIndex !== -1) {
    const decimalSeparator = commaIndex > dotIndex ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";
    text = text.replaceAll(thousandsSeparator, "").replace(decimalSeparator, ".");
  } else if (commaIndex !== -1) {
    text = normalizeSingleSeparatorNumber(text, ",");
  } else if (dotIndex !== -1) {
    text = normalizeSingleSeparatorNumber(text, ".");
  }

  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function normalizeSingleSeparatorNumber(value, separator) {
  const parts = value.split(separator);

  if (parts.length > 2 && parts.slice(1).every((part) => part.length === 3)) {
    return parts.join("");
  }

  if (parts.length === 2) {
    return separator === "," ? value.replace(",", ".") : value;
  }

  return value;
}

function cleanUpper(value) {
  return cleanText(value).toUpperCase();
}

function cleanText(value) {
  return String(value ?? "").trim();
}

function addDiscard(discardedRows, rowNumber, reason) {
  discardedRows.push({ rowNumber, reason });
}
