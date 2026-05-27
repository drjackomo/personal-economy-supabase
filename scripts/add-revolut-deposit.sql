alter table public.revolut_snapshots
add column if not exists revolut_deposit numeric default 0;

select
  table_schema,
  table_name,
  column_name,
  data_type,
  column_default,
  is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'revolut_snapshots'
  and column_name = 'revolut_deposit';

select
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'revolut_snapshots';

select
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'revolut_snapshots'
order by policyname;
