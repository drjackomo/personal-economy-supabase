// Read-only acceptance check. No RPC mutations, SQL execution, or financial writes.
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import assert from "node:assert/strict";
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Configura SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nel file .env locale.");
}
const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
async function rows(table, columns, order) {
  const result = [];
  for (let offset = 0; ; offset += 1000) {
    let request = client.from(table).select(columns);
    for (const column of order) request = request.order(column, { ascending: true });
    const { data, error } = await request.range(offset, offset + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    result.push(...data);
    if (data.length < 1000) return result;
  }
}
// Fixed point for acceptance checks: reject unsupported fractions, never round them.
function cents(value) {
  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(String(value));
  if (!match) throw new Error(`Valore monetario non verificabile in centesimi: ${value}`);
  return (match[1] ? -1n : 1n) * (BigInt(match[2]) * 100n + BigInt((match[3] ?? "").padEnd(2, "0")));
}
try {
  const [transactions, checkpoints] = await Promise.all([
    rows("transactions", "id,tx_id,date,created_at,amount,balance,account_id", ["date", "created_at", "id"]),
    rows("account_balance_checkpoints", "id,account_id,as_of_date,amount,checkpoint_type", ["account_id", "as_of_date"]),
  ]);
  assert.equal(transactions.length, 123, "Numero movimenti");
  assert.equal(checkpoints.length, 10, "Numero checkpoint");
  assert.ok(transactions.every(t => t.account_id === "FINECO_MAIN"));
  assert.ok(checkpoints.every(c => c.account_id === "FINECO_MAIN"));
  const certified = checkpoints.filter(c => c.checkpoint_type === "certified");
  assert.equal(certified.length, 1); assert.equal(certified[0].as_of_date, "2025-12-31");
  assert.equal(cents(certified[0].amount), 2353674n);
  let running = cents(certified[0].amount);
  for (const transaction of transactions) {
    assert.ok(transaction.date > certified[0].as_of_date);
    running += cents(transaction.amount);
    assert.equal(cents(transaction.balance), running, `Balance incoerente: ${transaction.tx_id}`);
  }
  assert.equal(running, 4032763n, "Saldo corrente");
  const derived = checkpoints.filter(c => c.checkpoint_type === "derived");
  assert.equal(derived.length, 9);
  for (let month = 1; month <= 9; month++) {
    const end = new Date(Date.UTC(2026, month, 0)).toISOString().slice(0, 10);
    const checkpoint = derived.find(c => c.as_of_date === end);
    assert.ok(checkpoint, `Checkpoint mancante: ${end}`);
    const expected = transactions.filter(t => t.date <= end)
      .reduce((sum, t) => sum + cents(t.amount), cents(certified[0].amount));
    assert.equal(cents(checkpoint.amount), expected, `Checkpoint incoerente: ${end}`);
  }
  console.log("PASS dati live: 123 movimenti, 10 checkpoint, certified 23.536,74 €, saldo 40.327,63 €, tutti i balance e derived coerenti.");
  console.log("Questa verifica read-only non conferma da sola che le RPC siano installate o che il collaudo UI sia completato.");
} catch (error) {
  console.error(`FAIL verifica read-only: ${error.message}`);
  process.exitCode = 1;
}
