import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
function extract(name) {
  const start = source.search(new RegExp(`^(?:async )?function ${name}\\(`, "m"));
  assert.ok(start >= 0, name);
  const rest = source.slice(start);
  const next = rest.slice(1).search(/^(?:async )?function \w+\(/m);
  const definition = next < 0 ? rest.split("\ninitAuthGate();")[0] : rest.slice(0, next + 1);
  return definition.split("\nconst ")[0];
}
class Element {
  constructor(tag = "div") {
    this.tag = tag; this.children = []; this.listeners = {}; this.dataset = {};
    this.style = {}; this.value = ""; this.checked = false; this.hidden = false;
    const classes = new Set();
    this.classList = { add: (...names) => names.forEach((name) => classes.add(name)), remove: (name) => classes.delete(name), toggle() {}, contains: (name) => classes.has(name) || (this.className || "").split(" ").includes(name) };
  }
  set textContent(value) { this.text = value; this.children = []; }
  get textContent() { return this.text; }
  get childNodes() { return this.children; }
  get options() { return this.children; }
  append(...items) { this.children.push(...items); }
  appendChild(item) { this.children.push(item); }
  replaceChildren(...items) { this.children = items; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  setAttribute(name, value) { this[name] = value; }
  setCustomValidity(message) { this.validationMessage = message; }
  reportValidity() { return !this.validationMessage; }
  querySelector(tag) { return this.children.find((item) => item.tag === tag); }
  contains(node) { return this === node || this.children.some((child) => child.contains?.(node)); }
  focus() {}
}
const defaults = {
  p_tag_ids: null, p_date_from: null, p_date_to: null, p_description: null,
  p_amount_from: null, p_amount_to: null, p_movement_type: "all", p_in_totals: null,
  p_tag_presence: "all", p_sort: "date_desc", p_page: 1, p_page_size: 50,
};
const item = { id: 1, tx_id: "t1", date: "2026-10-03", description: "Spesa", amount: -12,
  in_totals: true, balance: 100, tags: [{ id: 2, name: "Casa", color: "#123456" }] };
function reply(page = 1, items = [item], pages = 3) {
  return { data: { summary: { count: 123, income: 1000, expense: -100, net: 900 }, items,
    pagination: { page, page_size: 50, total_pages: pages, has_previous: page > 1, has_next: page < pages } }, error: null };
}
const flush = () => new Promise((resolve) => setImmediate(resolve));
function setup({ rpc, monthly } = {}) {
  const nodes = {}; const element = (id) => nodes[id] ??= new Element();
  const fields = Object.fromEntries(["date_from", "date_to", "description", "amount_from", "amount_to", "income", "expense", "sort"].map((name) => [name, new Element("input")]));
  const form = element("movimenti-search-form");
  form.elements = { namedItem: (name) => fields[name] ?? null };
  form.reset = () => { Object.values(fields).forEach((field) => { field.value = ""; field.checked = false; }); fields.income.checked = true; fields.expense.checked = true; fields.sort.value = "date_desc"; };
  form.reset(); form.requestSubmit = () => form.listeners.submit({ preventDefault() {} });
  const selector = { selectedIds: new Set(), search: new Element("input"), chips: new Element(), list: new Element(), catalog: [], emptyLabel: "Seleziona Tag" };
  const state = { mode: "monthly", appliedFilters: null, pagination: null, summary: null, requestId: 0, busy: false, form: null, selector: null };
  const calls = [], reads = [];
  class Clock extends Date { constructor(...args) { super(...(args.length ? args : ["2026-10-03T12:00:00+02:00"])); } }
  const box = { console, Date: Clock, Intl, Number, String, Set, document: { getElementById: element, createElement: (tag) => new Element(tag) }, window: {},
    movimentiSearchState: state, movimentiTableElement: element("movimenti-table"),
    movimentiMonthSelect: element("movimenti-month"), movimentiYearSelect: element("movimenti-year"),
    applyMovimentiFilterButton: element("apply-movimenti-filter"), movimentiPrevMonthButton: element("movimenti-prev-month"), movimentiNextMonthButton: element("movimenti-next-month"),
    supabaseClient: { rpc: async (name, params) => { calls.push({ name, params }); return rpc ? rpc(name, params) : reply(params.p_page); },
      from: (table) => { assert.equal(table, "transactions"); const read = { table }; reads.push(read); const query = {
        select(value) { read.select = value; return this; }, gte(key, value) { read.start = value; return this; },
        lt(key, value) { read.end = value; return this; }, order() { return this; }, limit(value) { read.limit = value; return monthly ? monthly(read) : Promise.resolve({ data: [item], error: null }); },
      }; return query; } },
    editMovement: (txId) => { box.edited = txId; }, openDeleteMovementModal: (txId) => { box.deleting = txId; },
    ensureMovementCheckpoints: async () => {}, loadMovimentiSummaries: async () => {}, setSummaryError() {},
    formatEuro: (value) => `EUR ${value}`, formatDate: (value) => value,
  };
  vm.createContext(box);
  const functions = ["buildTransactionSearchFilters", "validateTransactionSearchFilters", "fetchTransactionSearchPage", "getMovementTagColor", "styleMovementTagChip", "createMovementTagDot", "renderMovementTagSelector", "setMovementTagPanel", "renderMovimentiTable", "handleMovimentiTableAction", "renderMovimentiState", "getMovimentiDateRange", "initMovimentiFilters", "ensureMovimentiYearOption", "changeMovimentiMonth", "initMovimentiMonthNavigation", "setSummaryAmount", "getValueClass", "renderMovimentiSearchSummary", "updateMovimentiSearchPagination", "enterMovimentiMonthlyMode", "runMovimentiSearch", "refreshMovimentiAfterMutation", "resetMovimentiSearchFilters", "initMovimentiSearchControls", "loadMovimenti"];
  vm.runInContext(functions.map(extract).join("\n"), box);
  box.initMovimentiFilters(); box.initMovimentiSearchControls(form, selector); box.initMovimentiMonthNavigation();
  box.applyMovimentiFilterButton.addEventListener("click", box.loadMovimenti);
  const filters = () => box.buildTransactionSearchFilters(form, selector.selectedIds, true);
  const search = () => box.runMovimentiSearch(filters());
  const headers = () => box.movimentiTableElement.children[0].children[0].children[0].children.map((cell) => cell.textContent);
  return { box, state, form, fields, selector, element, calls, reads, filters, search, headers };
}

test("opening the page retains the current month, original monthly query and six columns", async () => {
  const c = setup(); await c.box.loadMovimenti();
  assert.equal(c.state.mode, "monthly"); assert.equal(c.calls.length, 0);
  assert.equal(c.reads[0].start, "2026-10-01"); assert.equal(c.reads[0].end, "2026-11-01"); assert.equal(c.reads[0].limit, 100);
  assert.deepEqual(c.headers(), ["Data", "Descrizione", "Movimento", "CC Fineco", "In cons.", "Azioni"]);
  assert.equal(c.fields.date_from.value, ""); assert.equal(c.fields.date_to.value, "");
  assert.equal(c.element("movimenti-search-pagination").hidden, true);
});
test("Cerca without filters sends exactly the required RPC defaults and keeps summary", async () => {
  const c = setup(); await c.search();
  assert.equal(c.calls[0].name, "search_transactions");
  assert.deepEqual(JSON.parse(JSON.stringify(c.calls[0].params)), defaults);
  assert.equal(c.reads.length, 0); assert.equal(c.state.summary.count, 123);
  assert.equal(c.state.mode, "search"); assert.deepEqual(c.headers(), ["Data", "Descrizione", "Movimento", "CC Fineco", "In cons.", "Azioni"]);
  assert.equal(c.element("movimenti-search-pagination").hidden, false);
  const chips = c.box.movimentiTableElement.children[0].children[1].children[0].children[1].children[0];
  assert.equal(chips.children[0].style.backgroundColor, "#123456");
});
for (const [name, draft, tags, expected] of [
  ["income only", { expense: false }, [], { p_movement_type: "income" }],
  ["expense only", { income: false }, [], { p_movement_type: "expense" }],
  ["one bigint Tag", {}, ["9007199254740993"], { p_tag_ids: ["9007199254740993"] }],
  ["multiple Tags", {}, ["9007199254740993", "2"], { p_tag_ids: ["2", "9007199254740993"] }],
  ["literal description", { description: "50% _ !" }, [], { p_description: "50% _ !" }],
  ["only date from", { date_from: "2025-01-01" }, [], { p_date_from: "2025-01-01" }],
  ["only date to", { date_to: "2025-12-31" }, [], { p_date_to: "2025-12-31" }],
  ["date range", { date_from: "2025-01-01", date_to: "2025-12-31" }, [], { p_date_from: "2025-01-01", p_date_to: "2025-12-31" }],
  ["absolute amount bounds", { amount_from: "0", amount_to: "12.34" }, [], { p_amount_from: 0, p_amount_to: 12.34 }],
  ["combined filters", { expense: false, date_from: "2024-01-01", description: "Casa", amount_from: "10", amount_to: "100", sort: "amount_asc" }, ["1", "2"], { p_movement_type: "income", p_date_from: "2024-01-01", p_description: "Casa", p_amount_from: 10, p_amount_to: 100, p_sort: "amount_asc", p_tag_ids: ["1", "2"] }],
]) test(`RPC mapping: ${name}`, async () => {
  const c = setup(); for (const [key, value] of Object.entries(draft)) { if (typeof value === "boolean") c.fields[key].checked = value; else c.fields[key].value = value; }
  tags.forEach((id) => c.selector.selectedIds.add(id)); await c.search();
  assert.deepEqual(JSON.parse(JSON.stringify(c.calls[0].params)), { ...defaults, ...expected });
});
test("pagination uses applied filters when draft inputs and Tags change", async () => {
  const c = setup(); c.fields.description.value = "applied"; c.selector.selectedIds.add("1"); await c.search();
  c.fields.description.value = "draft"; c.fields.sort.value = "amount_desc"; c.selector.selectedIds.add("2");
  c.element("movimenti-search-next").listeners.click(); await flush();
  assert.deepEqual(JSON.parse(JSON.stringify(c.calls[1].params)), { ...defaults, p_page: 2, p_description: "applied", p_tag_ids: ["1"] });
  c.element("movimenti-search-previous").listeners.click(); await flush(); assert.equal(c.calls[2].params.p_page, 1);
});
test("reset clears all controls and returns to the period currently selected in toolbar", async () => {
  const c = setup(); c.fields.description.value = "Casa"; c.fields.expense.checked = false; c.selector.selectedIds.add("1"); await c.search();
  c.box.movimentiMonthSelect.value = "8"; c.element("movimenti-search-reset").listeners.click(); await flush();
  assert.equal(c.state.mode, "monthly"); assert.deepEqual(JSON.parse(JSON.stringify(c.filters())), Object.fromEntries(Object.entries(defaults).filter(([key]) => !["p_page", "p_page_size"].includes(key))));
  assert.equal(c.reads[0].start, "2026-09-01"); assert.equal(c.calls.length, 1);
  assert.deepEqual(c.headers(), ["Data", "Descrizione", "Movimento", "CC Fineco", "In cons.", "Azioni"]);
  assert.equal(c.element("movimenti-search-pagination").hidden, true);
});
test("month arrows and Applica exit search without clearing draft controls", async () => {
  const c = setup(); c.fields.description.value = "keep draft"; await c.search();
  c.box.movimentiPrevMonthButton.listeners.click(); await flush(); assert.equal(c.state.mode, "monthly"); assert.equal(c.reads[0].start, "2026-09-01"); assert.equal(c.fields.description.value, "keep draft");
  await c.search(); c.box.movimentiMonthSelect.value = "1"; c.box.movimentiYearSelect.value = "2025";
  c.box.applyMovimentiFilterButton.listeners.click(); await flush(); assert.equal(c.state.mode, "monthly"); assert.equal(c.reads[1].start, "2025-02-01");
});
test("Enter submits the panel search from page one", async () => {
  const c = setup(); c.fields.description.value = "Enter";
  c.form.listeners.keydown({ key: "Enter", target: { matches: () => true }, preventDefault() {} }); await flush();
  assert.equal(c.calls[0].params.p_page, 1); assert.equal(c.calls[0].params.p_description, "Enter");
});
test("invalid ranges are rejected before calling RPC", async () => {
  const c = setup(); c.fields.date_from.value = "2026-10-03"; c.fields.date_to.value = "2026-10-01"; c.form.requestSubmit();
  assert.match(c.fields.date_from.validationMessage, /Data da/); assert.equal(c.calls.length, 0);
  c.fields.date_from.value = ""; c.fields.date_to.value = ""; c.fields.amount_from.value = "-1"; c.form.requestSubmit(); assert.equal(c.calls.length, 0);
});
test("empty results and single-page results hide pagination", async () => {
  for (const [items, pages] of [[[], 0], [[item], 1]]) {
    const c = setup({ rpc: () => reply(1, items, pages) }); await c.search();
    assert.equal(c.element("movimenti-search-pagination").hidden, true);
    if (!items.length) assert.equal(c.box.movimentiTableElement.children[0].className, "empty-state");
  }
});
test("RPC errors preserve draft and applied filters and allow retry", async () => {
  const c = setup({ rpc: () => ({ error: { message: "offline" } }) }); c.fields.description.value = "retain"; await c.search();
  assert.equal(c.fields.description.value, "retain"); assert.equal(c.state.appliedFilters.p_description, "retain");
  assert.equal(c.box.movimentiTableElement.children[0].className, "error-state"); assert.equal(c.state.busy, false);
  assert.equal(c.element("movimenti-search-submit").disabled, false); assert.equal(c.element("movimenti-search-pagination").hidden, true);
});
test("a pending search cannot overwrite a monthly view after reset", async () => {
  let resolve; const c = setup({ rpc: () => new Promise((done) => { resolve = done; }) });
  const search = c.search(); c.element("movimenti-search-reset").listeners.click(); await flush(); resolve(reply()); await search;
  assert.equal(c.state.mode, "monthly"); assert.equal(c.state.summary, null); assert.equal(c.headers().length, 6);
});
test("a pending monthly read cannot overwrite a newer search", async () => {
  let resolve; const c = setup({ monthly: () => new Promise((done) => { resolve = done; }) });
  const monthly = c.box.loadMovimenti(); await flush(); await c.search(); resolve({ data: [item], error: null }); await monthly;
  assert.equal(c.state.mode, "search"); assert.deepEqual(c.headers(), ["Data", "Descrizione", "Movimento", "CC Fineco", "In cons.", "Azioni"]);
});
test("monthly and search rows share identical markup, historical balance and action routing", async () => {
  const record = { ...item, balance: 987.65 };
  const monthlyRecord = { ...record, tags: undefined, transaction_tags: record.tags.map((tag) => ({ tags: tag })) };
  const c = setup({ monthly: () => Promise.resolve({ data: [monthlyRecord], error: null }), rpc: () => reply(1, [record]) });
  await c.box.loadMovimenti();
  const row = () => c.box.movimentiTableElement.children[0].children[1].children[0];
  const monthlyMarkup = JSON.stringify(row());
  await c.search();
  assert.equal(JSON.stringify(row()), monthlyMarkup);
  assert.equal(row().children[3].textContent, "EUR 987.65");
  assert.equal(row().children[4].children[0].className, "status-dot success");
  assert.equal(row().children[1].children[0].className, "movement-tag-chips movement-table-tags");
  const actions = row().children[5].children[0].children;
  c.box.handleMovimentiTableAction({ target: { closest: () => actions[0] } });
  c.box.handleMovimentiTableAction({ target: { closest: () => actions[1] } });
  assert.equal(c.box.edited, record.tx_id); assert.equal(c.box.deleting, record.tx_id);
  assert.equal(c.reads.length, 1); assert.equal(c.calls.length, 1);
});

test("a production RPC not yet upgraded cannot silently display a fabricated zero balance", async () => {
  const record = { ...item }; delete record.balance;
  const c = setup({ rpc: () => reply(1, [record]) }); await c.search();
  const state = c.box.movimentiTableElement.children[0];
  assert.equal(state.className, "error-state"); assert.match(state.children[0].textContent, /non restituisce ancora balance/);
  assert.equal(c.reads.length, 0);
});

test("the new RPC migration differs from its historical definition only by the two balance fields", () => {
  const historical = readFileSync(new URL("../supabase/migrations/20261002150000_search_transactions.sql", import.meta.url), "utf8");
  const upgraded = readFileSync(new URL("../supabase/migrations/20261003190000_search_transactions_balance.sql", import.meta.url), "utf8");
  assert.equal(upgraded.replace("      t.balance,\n", "").replace("          'balance', p.balance,\n", ""), historical);
  assert.match(upgraded, /FROM PUBLIC, anon, authenticated;/);
  assert.match(upgraded, /GRANT EXECUTE ON FUNCTION public\.search_transactions\([^;]+TO authenticated;/);
});

test("top and bottom pagers synchronize visibility, labels, disabled states and applied filters", async () => {
  const c = setup();
  const check = (page, previousDisabled, nextDisabled, hidden = false) => {
    for (const suffix of ["-top", ""]) {
      assert.equal(c.element(`movimenti-search-pagination${suffix}`).hidden, hidden);
      if (!hidden) assert.equal(c.element(`movimenti-search-page-label${suffix}`).textContent, `Pagina ${page} / 3`);
      assert.equal(c.element(`movimenti-search-previous${suffix}`).disabled, previousDisabled);
      assert.equal(c.element(`movimenti-search-next${suffix}`).disabled, nextDisabled);
    }
  };
  await c.box.loadMovimenti(); check(0, true, true, true);
  c.fields.description.value = "applied"; await c.search(); check(1, true, false);
  c.fields.description.value = "draft";
  c.element("movimenti-search-next-top").listeners.click(); await flush(); check(2, false, false);
  c.element("movimenti-search-next").listeners.click(); await flush(); check(3, false, true);
  c.element("movimenti-search-previous-top").listeners.click(); await flush(); check(2, false, false);
  c.element("movimenti-search-previous").listeners.click(); await flush(); check(1, true, false);
  for (const call of c.calls) assert.equal(call.params.p_description, "applied");
  assert.equal(c.fields.description.value, "draft"); assert.equal(c.state.mode, "search");
  c.element("movimenti-search-reset").listeners.click(); await flush(); check(0, true, true, true);
});

test("both pagers remain hidden for a single-page search", async () => {
  const c = setup({ rpc: () => reply(1, [item], 1) }); await c.search();
  for (const suffix of ["-top", ""]) assert.equal(c.element(`movimenti-search-pagination${suffix}`).hidden, true);
});

test("search summary card uses RPC values and shared monetary/color formatting", async () => {
  const c = setup(); await c.box.loadMovimenti(); assert.equal(c.element("movimenti-search-summary").hidden, true);
  await c.search(); assert.equal(c.element("movimenti-search-summary").hidden, false);
  assert.equal(c.element("movimenti-search-summary-count").textContent, "123 movimenti");
  assert.equal(c.element("movimenti-search-summary-income").innerHTML, '<span class="value-positive">EUR 1000</span>');
  assert.equal(c.element("movimenti-search-summary-expense").innerHTML, '<span class="value-negative">EUR -100</span>');
  assert.equal(c.element("movimenti-search-summary-net").innerHTML, '<span class="value-positive">EUR 900</span>');
});

test("summary stays visible and unchanged while paging; a new search replaces it", async () => {
  let resolvePage; let calls = 0;
  const c = setup({ rpc: (name, params) => {
    calls++;
    if (calls === 2) return new Promise((resolve) => { resolvePage = resolve; });
    const response = reply(params.p_page);
    if (calls === 3) response.data.summary = { count: 1, income: 2, expense: -5, net: -3 };
    return response;
  } });
  await c.search(); c.element("movimenti-search-next-top").listeners.click();
  assert.equal(c.element("movimenti-search-summary").hidden, false);
  assert.equal(c.element("movimenti-search-summary-count").textContent, "123 movimenti");
  const response = reply(2); response.data.summary.count = 999; resolvePage(response); await flush();
  assert.equal(c.state.summary.count, 123); assert.equal(c.element("movimenti-search-summary-count").textContent, "123 movimenti");
  c.fields.description.value = "new"; await c.search();
  assert.equal(c.element("movimenti-search-summary-count").textContent, "1 movimento");
  assert.equal(c.element("movimenti-search-summary-net").innerHTML, '<span class="value-negative">EUR -3</span>');
});

test("zero results still show a neutral, zero-valued summary card", async () => {
  const c = setup({ rpc: () => { const response = reply(1, [], 0); response.data.summary = { count: 0, income: 0, expense: 0, net: 0 }; return response; } });
  await c.search(); assert.equal(c.element("movimenti-search-summary").hidden, false);
  assert.equal(c.element("movimenti-search-summary-count").textContent, "0 movimenti");
  for (const key of ["income", "expense", "net"]) assert.equal(c.element(`movimenti-search-summary-${key}`).innerHTML, '<span class="value-neutral">EUR 0</span>');
});

test("reset, arrows and Applica hide the summary without extra search requests", async () => {
  const c = setup();
  for (const action of [() => c.element("movimenti-search-reset").listeners.click(), () => c.box.movimentiNextMonthButton.listeners.click(), () => c.box.applyMovimentiFilterButton.listeners.click()]) {
    await c.search(); assert.equal(c.element("movimenti-search-summary").hidden, false);
    const calls = c.calls.length; action(); await flush();
    assert.equal(c.element("movimenti-search-summary").hidden, true); assert.equal(c.state.mode, "monthly"); assert.equal(c.calls.length, calls);
  }
});

function installMutation(c, kind) {
  Object.assign(c.box, {
    movementSaving: false, movementTagsReady: true, modalMode: "edit", editingTxId: "t1",
    movementAccountId: "account", movementSelectedTagIds: new Set(["1"]), pendingDeleteTxId: "t1",
    getMovementFormData: () => ({ value: { date: item.date, description: "Updated", amount: -1200, inTotals: true } }),
    setMovementSubmitting() {}, showMovementModalError(message) { c.box.modalError = message; },
    closeMovementModal() {}, closeDeleteMovementModal() {},
    saveMovementPlaceholderButton: new Element(), confirmDeleteMovementButton: new Element(),
    deleteMovementModalError: new Element(), deleteMovementModal: new Element(),
  });
  vm.runInContext(extract(kind === "edit" ? "saveMovement" : "deleteMovement"), c.box);
  return () => c.box[kind === "edit" ? "saveMovement" : "deleteMovement"]();
}
for (const kind of ["edit", "delete"]) {
  test(`${kind} in monthly retains the original monthly refresh`, async () => {
    const c = setup({ rpc: () => ({ data: { transaction: item }, error: null }) });
    await installMutation(c, kind)();
    assert.equal(c.state.mode, "monthly"); assert.equal(c.reads.length, 1);
    assert.deepEqual(c.calls.map(call => call.name), [kind === "edit" ? "save_transaction" : "delete_transaction"]);
  });
  test(`${kind} in search refreshes applied filters, page, summary and historical balance`, async () => {
    let mutated = false;
    const updated = { ...item, description: "Updated", amount: -1200, balance: 432.17 };
    const freshSummary = { count: 122, income: 1000, expense: -1200, net: -200 };
    const c = setup({ rpc: (name, params) => {
      if (name !== "search_transactions") { mutated = true; return { data: { transaction: item }, error: null }; }
      const response = reply(params.p_page, mutated ? [updated] : [item]);
      if (mutated) response.data.summary = freshSummary;
      return response;
    } });
    c.selector.selectedIds.add("1"); await c.box.runMovimentiSearch(c.filters(), 2);
    c.fields.description.value = "draft"; c.selector.selectedIds.add("2");
    await installMutation(c, kind)();
    assert.equal(c.state.mode, "search"); assert.equal(c.reads.length, 0);
    assert.equal(c.state.pagination.page, 2);
    assert.deepEqual(JSON.parse(JSON.stringify(c.calls.at(-1).params)), { ...defaults, p_tag_ids: ["1"], p_page: 2 });
    assert.deepEqual(JSON.parse(JSON.stringify(c.state.summary)), freshSummary);
    assert.equal(c.element("movimenti-search-summary-count").textContent, "122 movimenti");
    const row = c.box.movimentiTableElement.children[0].children[1].children[0];
    assert.equal(row.children[3].textContent, "EUR 432.17");
    assert.match(JSON.stringify(row), /Updated/);
    assert.equal(c.fields.description.value, "draft"); assert.equal(c.selector.selectedIds.size, 2);
  });
}
test("an edited record leaving the filter is removed by the fresh RPC dataset", async () => {
  let mutated = false;
  const other = { ...item, tx_id: "remaining", description: "Remaining" };
  const c = setup({ rpc: (name, params) => {
    if (name === "save_transaction") { mutated = true; return { data: { transaction: item }, error: null }; }
    return reply(params.p_page, mutated ? [other] : [item, other]);
  } });
  c.fields.amount_from.value = "1000"; await c.search(); await installMutation(c, "edit")();
  const markup = JSON.stringify(c.box.movimentiTableElement);
  assert.match(markup, /remaining/); assert.doesNotMatch(markup, /"txId":"t1"/);
  assert.equal(c.calls.at(-1).params.p_amount_from, 1000);
});
test("post-delete refresh falls back once from page 3 to the final valid page 2", async () => {
  let mutated = false;
  const c = setup({ rpc: (name, params) => {
    if (name === "delete_transaction") { mutated = true; return { error: null }; }
    return reply(params.p_page, mutated && params.p_page === 3 ? [] : [item], mutated ? 2 : 3);
  } });
  await c.box.runMovimentiSearch(c.filters(), 3); await installMutation(c, "delete")();
  assert.deepEqual(c.calls.filter(call => call.name === "search_transactions").map(call => call.params.p_page), [3, 3, 2]);
  assert.equal(c.state.pagination.page, 2); assert.equal(c.state.pagination.total_pages, 2);
  assert.equal(c.state.mode, "search");
});
test("a dataset becoming empty normalizes page to 1 and displays the fresh zero summary", async () => {
  let mutated = false;
  const c = setup({ rpc: (name, params) => {
    if (name === "delete_transaction") { mutated = true; return { error: null }; }
    const response = reply(params.p_page, mutated ? [] : [item], mutated ? 0 : 3);
    if (mutated) response.data.summary = { count: 0, income: 0, expense: 0, net: 0 };
    return response;
  } });
  await c.box.runMovimentiSearch(c.filters(), 3); await installMutation(c, "delete")();
  assert.equal(c.state.pagination.page, 1); assert.equal(c.state.summary.count, 0);
  assert.equal(c.element("movimenti-search-summary").hidden, false);
  assert.equal(c.element("movimenti-search-summary-count").textContent, "0 movimenti");
  assert.equal(c.box.movimentiTableElement.children[0].className, "empty-state");
  assert.equal(c.calls.length, 3);
});
for (const kind of ["edit", "delete"]) test(`a failed ${kind} search refresh reports a loading error without retrying the mutation`, async () => {
  let mutated = false;
  const c = setup({ rpc: (name, params) => {
    if (name !== "search_transactions") { mutated = true; return { data: { transaction: item }, error: null }; }
    return mutated ? { error: { message: "offline" } } : reply(params.p_page);
  } });
  c.fields.description.value = "applied"; await c.search(); c.fields.description.value = "draft";
  await installMutation(c, kind)();
  assert.equal(c.state.mode, "search"); assert.equal(c.state.appliedFilters.p_description, "applied");
  assert.equal(c.fields.description.value, "draft"); assert.equal(c.state.summary, null);
  assert.equal(c.box.movimentiTableElement.children[0].className, "error-state");
  assert.equal(c.calls.filter(call => call.name !== "search_transactions").length, 1);
  assert.equal(c.box.modalError || c.box.deleteMovementModalError.textContent || "", "");
});
