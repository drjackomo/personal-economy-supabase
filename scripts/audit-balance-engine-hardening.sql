-- READ ONLY: run as postgres in Supabase SQL Editor before and after hardening.
-- One result set, one row: every audit section is a JSONB array.
BEGIN TRANSACTION READ ONLY;

WITH relations AS (
SELECT c.oid::regclass AS relation,pg_get_userbyid(c.relowner) AS owner,
 c.relrowsecurity,c.relforcerowsecurity,c.relacl
FROM pg_class c WHERE c.oid IN ('public.transactions'::regclass,
 'public.transaction_tags'::regclass,'public.account_balance_checkpoints'::regclass,'public.tags'::regclass)
),
table_privileges AS (
SELECT r.role_name,t.table_name,
 has_table_privilege(r.role_name,t.table_name,'SELECT') AS can_select,
 has_table_privilege(r.role_name,t.table_name,'INSERT') AS can_insert,
 has_table_privilege(r.role_name,t.table_name,'UPDATE') AS can_update,
 has_table_privilege(r.role_name,t.table_name,'DELETE') AS can_delete,
 has_table_privilege(r.role_name,t.table_name,'TRUNCATE') AS can_truncate,
 has_any_column_privilege(r.role_name,t.table_name,'INSERT') AS column_insert,
 has_any_column_privilege(r.role_name,t.table_name,'UPDATE') AS column_update
FROM (VALUES ('anon'),('authenticated')) r(role_name)
CROSS JOIN (VALUES ('public.transactions'),('public.transaction_tags'),
 ('public.account_balance_checkpoints'),('public.tags')) t(table_name)
),
column_privileges AS (
SELECT attrelid::regclass,attname,attacl FROM pg_attribute
WHERE attrelid IN ('public.transactions'::regclass,'public.transaction_tags'::regclass,
 'public.account_balance_checkpoints'::regclass) AND attacl IS NOT NULL
),
rls_policies AS (
SELECT * FROM pg_policies WHERE schemaname='public' AND tablename IN
 ('transactions','transaction_tags','account_balance_checkpoints','tags')
),
roles_and_membership AS (
SELECT r.rolname,r.rolsuper,r.rolbypassrls,
 pg_has_role('authenticated',r.oid,'MEMBER') AS authenticated_member,
 pg_has_role('anon',r.oid,'MEMBER') AS anon_member
FROM pg_roles r WHERE r.rolname IN ('anon','authenticated','postgres','service_role')
 OR pg_has_role('authenticated',r.oid,'MEMBER') OR pg_has_role('anon',r.oid,'MEMBER')
),
functions AS (
SELECT p.oid::regprocedure AS signature,pg_get_userbyid(p.proowner) AS owner,
 p.prosecdef,p.proconfig,has_function_privilege('anon',p.oid,'EXECUTE') AS anon_execute,
 has_function_privilege('authenticated',p.oid,'EXECUTE') AS authenticated_execute,
 pg_get_functiondef(p.oid) AS definition
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.prokind='f' AND
 (p.prosecdef OR p.proname LIKE '%balance%' OR p.proname IN
 ('save_transaction','delete_transaction','search_transactions')) ORDER BY p.proname
),
views AS (
SELECT table_schema,table_name,view_definition FROM information_schema.views WHERE table_schema='public'
),
triggers AS (
SELECT tgrelid::regclass,tgname,tgenabled,pg_get_triggerdef(oid)
 FROM pg_trigger WHERE NOT tgisinternal AND tgrelid IN
 ('public.transactions'::regclass,'public.transaction_tags'::regclass,
 'public.account_balance_checkpoints'::regclass,'public.tags'::regclass)
),
foreign_keys AS (
SELECT conrelid::regclass,confrelid::regclass,pg_get_constraintdef(oid)
 FROM pg_constraint WHERE contype='f' AND (conrelid IN
 ('public.transactions'::regclass,'public.transaction_tags'::regclass,'public.account_balance_checkpoints'::regclass)
 OR confrelid IN ('public.transactions'::regclass,'public.transaction_tags'::regclass,
 'public.account_balance_checkpoints'::regclass))
)
SELECT jsonb_build_object(
  'relations', COALESCE((SELECT jsonb_agg(to_jsonb(audit_row)) FROM relations audit_row), '[]'::jsonb),
  'table_privileges', COALESCE((SELECT jsonb_agg(to_jsonb(audit_row)) FROM table_privileges audit_row), '[]'::jsonb),
  'column_privileges', COALESCE((SELECT jsonb_agg(to_jsonb(audit_row)) FROM column_privileges audit_row), '[]'::jsonb),
  'rls_policies', COALESCE((SELECT jsonb_agg(to_jsonb(audit_row)) FROM rls_policies audit_row), '[]'::jsonb),
  'roles_and_membership', COALESCE((SELECT jsonb_agg(to_jsonb(audit_row)) FROM roles_and_membership audit_row), '[]'::jsonb),
  'functions', COALESCE((SELECT jsonb_agg(to_jsonb(audit_row)) FROM functions audit_row), '[]'::jsonb),
  'views', COALESCE((SELECT jsonb_agg(to_jsonb(audit_row)) FROM views audit_row), '[]'::jsonb),
  'triggers', COALESCE((SELECT jsonb_agg(to_jsonb(audit_row)) FROM triggers audit_row), '[]'::jsonb),
  'foreign_keys', COALESCE((SELECT jsonb_agg(to_jsonb(audit_row)) FROM foreign_keys audit_row), '[]'::jsonb)
) AS balance_engine_hardening_audit;

COMMIT;
