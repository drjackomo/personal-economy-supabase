import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
function extract(name) {
  const start = source.search(new RegExp(`^(?:async )?function ${name}\\(`, "m"));
  assert.ok(start >= 0, `Missing ${name}`);
  const rest = source.slice(start);
  const next = rest.slice(1).search(/^(?:async )?function \w+\(/m);
  return next < 0 ? rest.split("\ninitAuthGate();")[0] : rest.slice(0, next + 1);
}
function context(functions, rpc) {
  const calls = [];
  const box = {
    calls, console, Intl, Date, Set, crypto: { randomUUID: () => "fixed-create-id" },
    supabaseClient: { rpc: async (name, params) => {
      calls.push({ name, params });
      return rpc ? rpc(name, params) : { data: { transaction: { id: 12, tx_id: params.p_tx_id } }, error: null };
    }, from: () => { throw new Error("Direct table access forbidden in mutation test"); } },
    movementSaving: false, movementTagsReady: true, modalMode: "edit", editingTxId: "existing-id",
    movementCreateTxId: null, movementAccountId: "OTHER_ACCOUNT", movementTransactionId: null,
    movementSelectedTagIds: new Set(["9007199254740993", "2"]), movementOriginalTagIds: new Set(),
    movementCheckpointsPromise: null, movementCheckpointsMonth: null,
    saveMovementPlaceholderButton: {}, confirmDeleteMovementButton: {}, deleteMovementModalError: {},
    deleteMovementModal: { classList: { contains: () => false } },
    pendingDeleteTxId: "existing-id", message: "", closed: false, loads: 0,
    getMovementFormData: () => ({ value: { date: "2026-10-02", description: "Updated", amount: -9.39, inTotals: false } }),
    setMovementSubmitting: (busy) => { box.movementSaving = busy; },
    showMovementModalError: (message) => { box.message = message; },
    closeMovementModal: () => { box.closed = true; },
    closeDeleteMovementModal: () => { box.closed = true; },
    loadMovimenti: async () => { box.loads++; },
    refreshMovimentiAfterMutation: async () => { await box.loadMovimenti(); },
  };
  vm.createContext(box);
  vm.runInContext(functions.map(extract).join("\n"), box);
  return box;
}

test("update submits one atomic RPC, preserves account and bigint tag strings", async () => {
  const c = context(["saveMovement"]);
  await c.saveMovement();
  assert.equal(c.calls.length, 1);
  assert.equal(c.calls[0].name, "save_transaction");
  assert.equal(c.calls[0].params.p_operation, "update");
  assert.equal(c.calls[0].params.p_in_totals, true);
  assert.equal(c.calls[0].params.p_account_id, "OTHER_ACCOUNT");
  assert.equal(c.calls[0].params.p_tag_ids[0], "9007199254740993");
  assert.equal("balance" in c.calls[0].params, false);
  assert.equal(c.closed, true);
});
test("failed insert retries with same tx_id, without creating a fresh identity", async () => {
  const c = context(["saveMovement"], () => ({ error: { message: "Connection lost" } }));
  c.modalMode = "create";
  await c.saveMovement(); await c.saveMovement();
  assert.equal(c.calls[0].params.p_tx_id, c.calls[1].params.p_tx_id);
  assert.equal(c.modalMode, "create");
  assert.equal(c.closed, false);
});
test("failed atomic save keeps modal open and does not reload", async () => {
  const c = context(["saveMovement"], () => ({ error: { message: "Tag does not exist" } }));
  await c.saveMovement();
  assert.equal(c.closed, false); assert.equal(c.loads, 0);
  assert.match(c.message, /Tag does not exist/);
  assert.equal(c.movementSaving, false);
});
test("duplicate insert shows recovery guidance, never becomes an update silently", async () => {
  const c = context(["saveMovement"], () => ({ error: { code: "23505", message: "Duplicate" } }));
  c.modalMode = "create"; await c.saveMovement();
  assert.match(c.message, /già stato salvato/); assert.equal(c.modalMode, "create");
});
test("double submit and incomplete tag loading do not call the RPC", async () => {
  const c = context(["saveMovement"]);
  c.movementSaving = true; await c.saveMovement();
  c.movementSaving = false; c.movementTagsReady = false; await c.saveMovement();
  assert.equal(c.calls.length, 0);
});
test("delete uses one RPC with no client read/rebuild", async () => {
  const c = context(["deleteMovement"]);
  await c.deleteMovement();
  assert.equal(c.calls.length, 1); assert.equal(c.calls[0].name, "delete_transaction");
  assert.equal(c.closed, true);
});
test("current balance comes from RPC; null/invalid values fail instead of zero", async () => {
  const c = context(["getCurrentFinecoBalance"], () => ({ data: "40327.63" }));
  assert.equal(await c.getCurrentFinecoBalance(), 40327.63);
  assert.equal(c.calls[0].name, "get_account_balance");
  for (const data of [null, undefined, "", "NaN"]) {
    const bad = context(["getCurrentFinecoBalance"], () => ({ data }));
    await assert.rejects(bad.getCurrentFinecoBalance(), /saldo valido/);
  }
});
test("checkpoint initialization is coalesced and not repeated on reload after saves", async () => {
  const c = context(["ensureMovementCheckpoints"], () => ({ error: null }));
  await Promise.all([c.ensureMovementCheckpoints(), c.ensureMovementCheckpoints()]);
  await c.ensureMovementCheckpoints();
  assert.equal(c.calls.length, 1);
  c.movementCheckpointsMonth = "previous-month";
  await c.ensureMovementCheckpoints();
  assert.equal(c.calls.length, 2);
});
test("failed checkpoint initialization can be retried", async () => {
  const c = context(["ensureMovementCheckpoints"], () => ({ error: { message: "Base missing" } }));
  await assert.rejects(c.ensureMovementCheckpoints());
  assert.equal(c.movementCheckpointsPromise, null);
  await assert.rejects(c.ensureMovementCheckpoints());
  assert.equal(c.calls.length, 2);
});
test("old engine and direct tag synchronization removed; preview performs no arithmetic", () => {
  assert.doesNotMatch(source, /recalculateBalancesFrom|syncMovementTags|roundBalance|compareTransactionPosition/);
  const c = context(["updateSaldoPreview"]);
  c.nextBalancePreview = {}; c.updateSaldoPreview();
  assert.equal(c.nextBalancePreview.textContent, "Aggiornato al salvataggio");
});

 test("new movement always saves in_totals true even with a stale false form value", async () => {
  const c = context(["saveMovement"]);
  c.modalMode = "create";
  await c.saveMovement();
  assert.equal(c.calls[0].params.p_operation, "insert");
  assert.equal(c.calls[0].params.p_in_totals, true);
  assert.equal(c.closed, true);
});
