// Isolated PostgreSQL; never reads .env or connects to Supabase.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const runtime = process.env.BALANCE_TEST_RUNTIME;
if (!runtime) throw new Error('Set BALANCE_TEST_RUNTIME to the temporary PGlite package.json');
const { PGlite } = createRequire(runtime)('@electric-sql/pglite');
const db = new PGlite();
await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated;
CREATE TABLE transactions(id bigint PRIMARY KEY, tx_id text, date date, description text, amount numeric, balance numeric, in_totals boolean);
CREATE TABLE tags(id bigint PRIMARY KEY, name text, color text);
CREATE TABLE transaction_tags(transaction_id bigint, tag_id bigint);
INSERT INTO tags VALUES (1,'Stipendio','#111111'),(2,'Rimborso','#222222'),(3,'Investimenti','#333333'),(4,'Fineco','#444444');
INSERT INTO transactions VALUES
(1,'a','2026-10-01','Stipendio',100,100,true),
(2,'b','2026-10-02','Rimborso',20,120,true),
(3,'c','2026-10-03','Investimenti Fineco',-10,110,false),
(4,'d','2026-10-04','Investimenti',30,140,true),
(5,'e','2026-10-05','Senza tag',-5,135,true);
INSERT INTO transaction_tags VALUES (1,1),(2,2),(3,3),(3,4),(4,3);`);
const migration = name => readFileSync(new URL(`../supabase/migrations/${name}`, import.meta.url),'utf8');
await db.exec(migration('20261003190000_search_transactions_balance.sql'));
const search = async (args = '') => (await db.query(`SELECT public.search_transactions(${args}) AS result`)).rows[0].result;
const otherFilters = ['', "p_date_from => '2026-10-02', p_date_to => '2026-10-04'", "p_description => 'Investimenti'", 'p_amount_from => 10, p_amount_to => 30', "p_movement_type => 'income'", "p_movement_type => 'expense'", 'p_in_totals => false', "p_tag_presence => 'with_tags'", "p_tag_presence => 'without_tags'", "p_sort => 'date_asc'", "p_sort => 'amount_desc'", "p_sort => 'amount_asc', p_page => 2, p_page_size => 2", 'p_tag_ids => ARRAY[3]::bigint[]'];
const before = await Promise.all(otherFilters.map(search));
await db.exec(migration('20261003200000_search_transactions_exclude_tags.sql'));
assert.deepEqual(await Promise.all(otherFilters.map(search)), before, 'All existing filters, pagination, summary, tags and balance preserved');
for (const [args, ids] of [
  ['p_tag_ids => ARRAY[1,3]::bigint[]',[4,3,1]],
  ['p_exclude_tag_ids => ARRAY[1]::bigint[]',[5,4,3,2]],
  ['p_exclude_tag_ids => ARRAY[1,2]::bigint[]',[5,4,3]],
  ['p_tag_ids => ARRAY[3]::bigint[], p_exclude_tag_ids => ARRAY[4]::bigint[]',[4]],
  ['', [5,4,3,2,1]],
  ["p_movement_type => 'income', p_exclude_tag_ids => ARRAY[1]::bigint[]",[4,2]],
  ['p_tag_ids => ARRAY[3]::bigint[], p_exclude_tag_ids => ARRAY[3]::bigint[]',[]],
  ['p_exclude_tag_ids => ARRAY[]::bigint[]',[5,4,3,2,1]],
  ["p_tag_presence => 'without_tags', p_exclude_tag_ids => ARRAY[1]::bigint[]",[5]],
]) {
  const result = await search(args);
  assert.deepEqual(result.items.map(item => item.id),ids,args);
  assert.equal(result.summary.count,ids.length);
  const amounts = {1:100,2:20,3:-10,4:30,5:-5};
  assert.equal(result.summary.net,ids.reduce((sum,id) => sum+amounts[id],0));
  assert.equal(result.summary.income,ids.reduce((sum,id) => sum+Math.max(amounts[id],0),0));
  assert.equal(result.summary.expense,ids.reduce((sum,id) => sum+Math.min(amounts[id],0),0));
}
const page = await search('p_exclude_tag_ids => ARRAY[1,2]::bigint[], p_page => 2, p_page_size => 2');
assert.deepEqual(page.items.map(item => item.id),[3]); assert.equal(page.items[0].balance,110);
assert.equal(page.summary.count,3); assert.equal(page.pagination.total_pages,2);
for (const value of ['ARRAY[NULL]::bigint[]','ARRAY[0]::bigint[]','ARRAY[-1]::bigint[]']) {
  await assert.rejects(search(`p_exclude_tag_ids => ${value}`), /ID positivi/);
}
const metadata = (await db.query(`SELECT prosecdef, proconfig, has_function_privilege('authenticated',oid,'EXECUTE') AS authenticated, has_function_privilege('anon',oid,'EXECUTE') AS anon FROM pg_proc WHERE proname='search_transactions'`)).rows;
assert.equal(metadata.length,1); assert.equal(metadata[0].prosecdef,false);
assert.deepEqual(metadata[0].proconfig,['search_path=pg_catalog']);
assert.equal(metadata[0].authenticated,true); assert.equal(metadata[0].anon,false);
await db.close();
console.log('PASS: search SQL semantics, regression parity, pagination, summary, balance, validation and privileges');
