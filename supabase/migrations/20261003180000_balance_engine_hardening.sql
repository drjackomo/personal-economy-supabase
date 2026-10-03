-- Install only AFTER reviewing scripts/audit-balance-engine-hardening.sql on production.
-- Privilege-only hardening: no data writes, function replacements or RLS changes.
-- SELECT privileges and SELECT/ALL policies are deliberately preserved.
-- RLS ALL policies cannot grant privileges revoked below.
-- tags CRUD (including its intentional association-delete cascade) is preserved.
BEGIN;

DO $$
DECLARE f record; r text;
BEGIN
  -- SECURITY DEFINER entry points must keep working independently of client DML/RLS.
  FOR f IN SELECT p.*, owner.rolsuper, owner.rolbypassrls
    FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
    JOIN pg_roles owner ON owner.oid=p.proowner
    WHERE n.nspname='public' AND p.proname IN
      ('save_transaction','delete_transaction','ensure_balance_checkpoints','get_account_balance')
  LOOP
    IF NOT f.prosecdef OR NOT (f.rolsuper OR f.rolbypassrls) THEN
      RAISE EXCEPTION 'Review RPC owner/RLS before hardening: %',f.oid::regprocedure;
    END IF;
    FOREACH r IN ARRAY ARRAY['anon','authenticated'] LOOP
      IF pg_has_role(r,f.proowner,'MEMBER') THEN
        RAISE EXCEPTION 'Client role % can assume RPC owner for %',r,f.oid::regprocedure;
      END IF;
    END LOOP;
  END LOOP;
END $$;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE
  public.transactions, public.transaction_tags, public.account_balance_checkpoints
  FROM PUBLIC, anon, authenticated;

-- Table REVOKE does not remove independent column INSERT/UPDATE grants.
DO $$
DECLARE t regclass; cols text;
BEGIN
  FOREACH t IN ARRAY ARRAY['public.transactions'::regclass,
    'public.transaction_tags'::regclass,'public.account_balance_checkpoints'::regclass] LOOP
    SELECT string_agg(quote_ident(attname),', ' ORDER BY attnum) INTO cols
      FROM pg_attribute WHERE attrelid=t AND attnum>0 AND NOT attisdropped;
    EXECUTE format('REVOKE INSERT (%s), UPDATE (%s) ON TABLE %s FROM PUBLIC, anon, authenticated',cols,cols,t);
  END LOOP;
END $$;

REVOKE ALL ON FUNCTION public.protect_certified_balance_checkpoint() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._balance_assert_authenticated() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._balance_engine_lock() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._balance_validate_account(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._balance_first_invalid_month(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._balance_rebuild(text, date) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._balance_sync_tags(bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ensure_balance_checkpoints(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.save_transaction(text, text, date, text, numeric, text, boolean, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_transaction(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_account_balance(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_balance_checkpoints(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.save_transaction(text, text, date, text, numeric, text, boolean, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_transaction(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_account_balance(text) TO authenticated;

-- Preserve the audited read-only search RPC; deny anonymous/default EXECUTE.
REVOKE ALL ON FUNCTION public.search_transactions(bigint[], date, date, text, numeric, numeric, text, boolean, text, text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_transactions(bigint[], date, date, text, numeric, numeric, text, boolean, text, text, integer, integer) TO authenticated;

-- Fail closed: inherited grants and ownership cannot be fixed by a direct REVOKE.
DO $$
DECLARE t regclass; r text; f record;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon','authenticated'] LOOP
    FOREACH t IN ARRAY ARRAY['public.transactions'::regclass,
      'public.transaction_tags'::regclass,'public.account_balance_checkpoints'::regclass] LOOP
      IF has_table_privilege(r,t,'INSERT') OR has_table_privilege(r,t,'UPDATE')
        OR has_table_privilege(r,t,'DELETE') OR has_table_privilege(r,t,'TRUNCATE')
        OR has_any_column_privilege(r,t,'INSERT') OR has_any_column_privilege(r,t,'UPDATE') THEN
        RAISE EXCEPTION 'Effective write privilege remains for % on %; review inherited grants',r,t;
      END IF;
    END LOOP;
    FOR f IN SELECT p.oid,p.proname FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
      WHERE n.nspname='public' AND (p.proname LIKE '\_balance\_%' ESCAPE '\'
        OR p.proname='protect_certified_balance_checkpoint'
        OR p.proname IN ('save_transaction','delete_transaction','ensure_balance_checkpoints','get_account_balance','search_transactions'))
    LOOP
      IF has_function_privilege(r,f.oid,'EXECUTE') IS DISTINCT FROM
        (r='authenticated' AND f.proname IN
          ('save_transaction','delete_transaction','ensure_balance_checkpoints','get_account_balance','search_transactions')) THEN
        RAISE EXCEPTION 'Unexpected effective EXECUTE for % on %',r,f.oid::regprocedure;
      END IF;
    END LOOP;
  END LOOP;
END $$;
COMMIT;
