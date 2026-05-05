import "dotenv/config";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_CSV_PATH = "data/investments_snapshots_aprile_fix.csv";
const BATCH_SIZE = 500;
const MAX_REPORTED_ERRORS = 10;

const COLUMN_ALIASES = {
  snapshot_date: ["snapshot_date", "date", "data"],
  account_id: ["account_id", "dossier_id", "account", "dossier"],
  value: ["value", "market_value", "valore", "amount", "total_value", "total"],
  note: ["note", "notes", "nota"],
};

const args = parseArgs(process.argv.slice(2));
const csvPath = resolve(process.cwd(), args.csvPath);

if (!existsSync(csvPath)) {
  console.error(`Errore: file CSV non trovato: ${csvPath}`);
  process.exit(1);
}

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

if (rows.length === 0) {
  console.error("Errore: il CSV non contiene righe dati");
  process.exit(1);
}

validateRequiredColumns(rows[0]);

const discardedRows = [];
const validRows = [];
const seenKeys = new Set();

for (const [index, row] of rows.entries()) {
  const rowNumber = index + 2;
  const mappedRow = mapCsvRow(row);
  const normalizedRow = normalizeRow(mappedRow);

  if (normalizedRow.errors.length > 0) {
    addDiscard(discardedRows, rowNumber, normalizedRow.errors.join("; "));
    continue;
  }

  const logicalKey = `${normalizedRow.value.snapshot_date}|${normalizedRow.value.account_id}`;

  if (seenKeys.has(logicalKey)) {
    addDiscard(discardedRows, rowNumber, `chiave duplicata nel CSV: ${logicalKey}`);
    continue;
  }

  seenKeys.add(logicalKey);
  validRows.push(normalizedRow.value);
}

printReport(rows.length, validRows, discardedRows, args.apply);

if (discardedRows.length > 0) {
  console.error("Errore: correggi le righe scartate prima di eseguire l'import");
  process.exit(1);
}

if (!args.apply) {
  console.log("Dry-run completato: nessuna scrittura effettuata.");
  console.log("Per importare su Supabase riesegui con --apply.");
  process.exit(0);
}

const { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Errore: configura SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nel file .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const existingRows = await findExistingRows(supabase, validRows);

if (existingRows.length > 0) {
  console.error("Errore: esistono già righe con le stesse coppie snapshot_date + account_id.");
  console.error("Import bloccato: nessuna scrittura effettuata.");
  console.table(existingRows);
  process.exit(1);
}

let insertedRows = 0;

for (let index = 0; index < validRows.length; index += BATCH_SIZE) {
  const batch = validRows.slice(index, index + BATCH_SIZE);
  const { error } = await supabase.from("investments_snapshots").insert(batch);

  if (error) {
    console.error(`Errore insert batch ${Math.floor(index / BATCH_SIZE) + 1}:`, error.message);
    process.exit(1);
  }

  insertedRows += batch.length;
}

console.log("Import investments_snapshots completato");
console.log(`Righe inserite: ${insertedRows}`);

function parseArgs(argv) {
  const result = {
    apply: false,
    csvPath: DEFAULT_CSV_PATH,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--apply") {
      result.apply = true;
      continue;
    }

    if (arg === "--csv") {
      const nextValue = argv[index + 1];

      if (!nextValue || nextValue.startsWith("--")) {
        console.error("Errore: --csv richiede un percorso file");
        process.exit(1);
      }

      result.csvPath = nextValue;
      index += 1;
      continue;
    }

    if (!arg.startsWith("--")) {
      result.csvPath = arg;
      continue;
    }

    console.error(`Errore: opzione non riconosciuta ${arg}`);
    process.exit(1);
  }

  return result;
}

function validateRequiredColumns(sampleRow) {
  const normalizedHeaders = new Set(Object.keys(sampleRow).map(normalizeHeader));
  const requiredColumns = ["snapshot_date", "account_id", "value"];
  const missingColumns = [];

  for (const columnName of requiredColumns) {
    const aliases = COLUMN_ALIASES[columnName];
    const hasColumn = aliases.some((alias) => normalizedHeaders.has(normalizeHeader(alias)));

    if (!hasColumn) {
      missingColumns.push(`${columnName} (${aliases.join(" oppure ")})`);
    }
  }

  if (missingColumns.length > 0) {
    console.error("Errore: colonne obbligatorie mancanti:");
    for (const column of missingColumns) {
      console.error(`- ${column}`);
    }
    process.exit(1);
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
  const accountId = cleanUpper(row.account_id);
  const value = parseMoneyValue(row.value);

  if (!snapshotDate) {
    errors.push("snapshot_date/date mancante o non valida");
  }

  if (!accountId) {
    errors.push("account_id/dossier_id mancante");
  }

  if (value === null) {
    errors.push("value/market_value mancante o non valido");
  }

  return {
    errors,
    value: {
      snapshot_date: snapshotDate,
      account_id: accountId,
      value,
      note: cleanText(row.note) || null,
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

  const slashIsoMatch = text.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (slashIsoMatch) {
    return buildDate(Number(slashIsoMatch[1]), Number(slashIsoMatch[2]), Number(slashIsoMatch[3]));
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

function parseMoneyValue(value) {
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

function printReport(readRows, validRows, discardedRows, apply) {
  console.log(`Modalità: ${apply ? "APPLY" : "DRY-RUN"}`);
  console.log(`Righe lette: ${readRows}`);
  console.log(`Righe valide: ${validRows.length}`);
  console.log(`Righe scartate: ${discardedRows.length}`);
  console.log(`Date trovate: ${uniqueValues(validRows, "snapshot_date").join(", ") || "—"}`);
  console.log(`Account trovati: ${uniqueValues(validRows, "account_id").join(", ") || "—"}`);
  console.log("");
  console.log("Totale per data:");

  for (const [date, total] of Object.entries(sumByDate(validRows))) {
    console.log(`- ${date}: ${formatCurrency(total)}`);
  }

  console.log("");
  console.log("Righe normalizzate:");
  console.table(validRows);

  if (discardedRows.length > 0) {
    console.log(`Primi ${Math.min(MAX_REPORTED_ERRORS, discardedRows.length)} errori/scarti:`);
    for (const discardedRow of discardedRows.slice(0, MAX_REPORTED_ERRORS)) {
      console.log(`- Riga ${discardedRow.rowNumber}: ${discardedRow.reason}`);
    }
  }
}

async function findExistingRows(supabaseClient, rowsToInsert) {
  if (rowsToInsert.length === 0) {
    return [];
  }

  const expectedKeys = new Set(rowsToInsert.map((row) => getLogicalKey(row)));
  const dates = uniqueValues(rowsToInsert, "snapshot_date");
  const accountIds = uniqueValues(rowsToInsert, "account_id");
  const existingRows = [];

  for (let dateIndex = 0; dateIndex < dates.length; dateIndex += BATCH_SIZE) {
    const dateBatch = dates.slice(dateIndex, dateIndex + BATCH_SIZE);

    for (let accountIndex = 0; accountIndex < accountIds.length; accountIndex += BATCH_SIZE) {
      const accountBatch = accountIds.slice(accountIndex, accountIndex + BATCH_SIZE);
      const { data, error } = await supabaseClient
        .from("investments_snapshots")
        .select("snapshot_date,account_id,value,note")
        .in("snapshot_date", dateBatch)
        .in("account_id", accountBatch);

      if (error) {
        console.error("Errore controllo duplicati:", error.message);
        process.exit(1);
      }

      for (const row of data ?? []) {
        const normalizedRow = {
          snapshot_date: row.snapshot_date,
          account_id: cleanUpper(row.account_id),
          value: Number(row.value),
          note: row.note ?? null,
        };

        if (expectedKeys.has(getLogicalKey(normalizedRow))) {
          existingRows.push(normalizedRow);
        }
      }
    }
  }

  return existingRows.sort((rowA, rowB) => getLogicalKey(rowA).localeCompare(getLogicalKey(rowB)));
}

function getLogicalKey(row) {
  return `${row.snapshot_date}|${row.account_id}`;
}

function sumByDate(rows) {
  const result = {};

  for (const row of rows) {
    result[row.snapshot_date] = (result[row.snapshot_date] ?? 0) + row.value;
  }

  return Object.fromEntries(Object.entries(result).sort(([dateA], [dateB]) => dateA.localeCompare(dateB)));
}

function uniqueValues(rows, columnName) {
  return [...new Set(rows.map((row) => row[columnName]))].sort();
}

function formatCurrency(value) {
  return value.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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
