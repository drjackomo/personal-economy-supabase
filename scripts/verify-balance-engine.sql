-- READ-ONLY. Run after installation and again after opening Movimenti.
-- Expected baseline: 123 transactions, 10 checkpoints, certified 23536.74,
-- stored/current independent balance 40327.63, zero discrepancies.
WITH origin AS (
  SELECT * FROM public.account_balance_checkpoints
  WHERE account_id = 'FINECO_MAIN' AND checkpoint_type = 'certified'
), expected AS (
  SELECT t.id, t.balance, o.amount + sum(t.amount) OVER (
    ORDER BY t.date, t.created_at, t.id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS expected_balance
  FROM public.transactions t JOIN origin o ON o.account_id = t.account_id WHERE t.date > o.as_of_date
), derived_errors AS (
  SELECT d.id FROM public.account_balance_checkpoints d JOIN origin o ON o.account_id = d.account_id
  WHERE d.checkpoint_type = 'derived' AND d.amount IS DISTINCT FROM o.amount + coalesce((
    SELECT sum(t.amount) FROM public.transactions t
    WHERE t.account_id = d.account_id AND t.date > o.as_of_date AND t.date <= d.as_of_date
  ), 0::numeric)
), baseline AS (
  SELECT
    (SELECT count(*) FROM public.transactions) AS transactions,
    (SELECT count(*) FROM public.account_balance_checkpoints) AS checkpoints,
    (SELECT count(*) FROM origin WHERE as_of_date = DATE '2025-12-31' AND amount = 23536.74) AS certified_matches,
    (SELECT amount + coalesce((SELECT sum(t.amount) FROM public.transactions t WHERE t.account_id = o.account_id AND t.date > o.as_of_date), 0::numeric) FROM origin o) AS independent_balance,
    (SELECT balance FROM public.transactions WHERE account_id = 'FINECO_MAIN' ORDER BY date DESC, created_at DESC, id DESC LIMIT 1) AS stored_balance,
    (SELECT count(*) FROM expected WHERE balance IS DISTINCT FROM expected_balance) AS balance_errors,
    (SELECT count(*) FROM derived_errors) AS checkpoint_errors,
    (SELECT count(*) FROM public.account_balance_checkpoints WHERE as_of_date >= date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Rome')::date) AS premature_checkpoints,
    (SELECT count(*) FROM public.transactions WHERE account_id <> 'FINECO_MAIN') AS other_account_transactions,
    (SELECT count(*) FROM public.account_balance_checkpoints WHERE account_id <> 'FINECO_MAIN') AS other_account_checkpoints
)
SELECT *, transactions = 123 AND checkpoints = 10 AND certified_matches = 1
  AND independent_balance = 40327.63 AND stored_balance = 40327.63
  AND balance_errors = 0 AND checkpoint_errors = 0 AND premature_checkpoints = 0
  AND other_account_transactions = 0 AND other_account_checkpoints = 0 AS baseline_passed
FROM baseline;

-- Continuity: every completed month after certified must exist. Expected zero rows.
SELECT o.account_id, g.month_start::date AS missing_month
FROM public.account_balance_checkpoints o
CROSS JOIN LATERAL generate_series((o.as_of_date + 1)::timestamp,
  (date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Rome') - interval '1 month')::timestamp,
  interval '1 month') g(month_start)
WHERE o.checkpoint_type = 'certified' AND NOT EXISTS (
  SELECT 1 FROM public.account_balance_checkpoints c WHERE c.account_id = o.account_id
    AND c.as_of_date = (g.month_start + interval '1 month' - interval '1 day')::date
    AND c.checkpoint_type = 'derived'
);

-- Trigger must be enabled (O); inspect TG_OP / RETURN OLD for DELETE.
SELECT tgname, tgenabled, pg_get_triggerdef(oid)
FROM pg_trigger WHERE tgrelid = 'public.account_balance_checkpoints'::regclass AND NOT tgisinternal;
SELECT pg_get_functiondef('public.protect_certified_balance_checkpoint()'::regprocedure);

-- anon false for all; authenticated true only for the four public RPCs.
SELECT p.oid::regprocedure AS function_signature, pg_get_userbyid(p.proowner) AS owner,
  p.prosecdef, p.proconfig,
  has_function_privilege('anon', p.oid, 'EXECUTE') AS anon_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') AS authenticated_execute
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname IN (
  'protect_certified_balance_checkpoint', '_balance_assert_authenticated', '_balance_engine_lock',
  '_balance_validate_account', '_balance_first_invalid_month', '_balance_rebuild', '_balance_sync_tags',
  'ensure_balance_checkpoints', 'save_transaction', 'delete_transaction', 'get_account_balance'
) ORDER BY p.proname;
