-- Reviewed balance engine. Install as postgres in Supabase SQL Editor.
-- Installation changes only schema/functions/privileges; no financial data writes.
-- Table DML remains open until the frontend and database have been verified.
BEGIN;

ALTER TABLE public.transactions
  ALTER COLUMN date SET NOT NULL,
  ALTER COLUMN amount SET NOT NULL,
  ALTER COLUMN account_id SET NOT NULL,
  ALTER COLUMN tx_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_constraint
    WHERE conrelid = 'public.transactions'::regclass
      AND conname = 'transactions_balance_engine_valid_values') THEN
    ALTER TABLE public.transactions ADD CONSTRAINT transactions_balance_engine_valid_values
      CHECK (pg_catalog.isfinite(date) AND btrim(account_id) <> '' AND btrim(tx_id) <> ''
        AND amount::text NOT IN ('NaN', 'Infinity', '-Infinity')
        AND (balance IS NULL OR balance::text NOT IN ('NaN', 'Infinity', '-Infinity')));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_constraint
    WHERE conrelid = 'public.account_balance_checkpoints'::regclass
      AND conname = 'balance_checkpoints_engine_valid_values') THEN
    ALTER TABLE public.account_balance_checkpoints ADD CONSTRAINT balance_checkpoints_engine_valid_values
      CHECK (btrim(account_id) <> '' AND pg_catalog.isfinite(as_of_date)
        AND amount::text NOT IN ('NaN', 'Infinity', '-Infinity')
        AND as_of_date = (date_trunc('month', as_of_date::timestamp)
          + interval '1 month' - interval '1 day')::date);
  END IF;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS transactions_balance_engine_tx_id_uidx ON public.transactions(tx_id);
CREATE INDEX IF NOT EXISTS transactions_balance_engine_order_idx ON public.transactions(account_id, date, created_at, id);
CREATE UNIQUE INDEX IF NOT EXISTS balance_checkpoints_engine_certified_uidx
  ON public.account_balance_checkpoints(account_id) WHERE checkpoint_type = 'certified';

CREATE OR REPLACE FUNCTION public.protect_certified_balance_checkpoint()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.checkpoint_type = 'certified' THEN RAISE EXCEPTION 'DELETE del checkpoint certified vietato'; END IF;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.checkpoint_type = 'certified' THEN RAISE EXCEPTION 'UPDATE del checkpoint certified vietato'; END IF;
    IF NEW.checkpoint_type = 'certified' THEN RAISE EXCEPTION 'Promozione derived -> certified vietata'; END IF;
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Operazione trigger inattesa: %', TG_OP;
END;
$$;
DROP TRIGGER IF EXISTS protect_certified_balance_checkpoint ON public.account_balance_checkpoints;
CREATE TRIGGER protect_certified_balance_checkpoint BEFORE UPDATE OR DELETE
  ON public.account_balance_checkpoints FOR EACH ROW EXECUTE FUNCTION public.protect_certified_balance_checkpoint();

CREATE FUNCTION public._balance_assert_authenticated()
RETURNS void LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sessione autenticata richiesta' USING ERRCODE = '42501'; END IF;
END;
$$;
CREATE FUNCTION public._balance_engine_lock()
RETURNS void LANGUAGE plpgsql VOLATILE SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(742019, 1);
END;
$$;

CREATE FUNCTION public._balance_validate_account(p_account_id text)
RETURNS date LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  v_count bigint; v_certified_date date;
  v_today date := (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Rome')::date;
  v_current_month date := date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Rome')::date;
BEGIN
  IF p_account_id IS NULL OR btrim(p_account_id) = '' THEN RAISE EXCEPTION 'account_id obbligatorio'; END IF;
  SELECT count(*), min(c.as_of_date) INTO v_count, v_certified_date
    FROM public.account_balance_checkpoints c WHERE c.account_id = p_account_id AND c.checkpoint_type = 'certified';
  IF v_count <> 1 THEN RAISE EXCEPTION 'Il conto % deve avere esattamente un certified', p_account_id; END IF;
  IF NOT pg_catalog.isfinite(v_certified_date) OR v_certified_date >= v_current_month THEN
    RAISE EXCEPTION 'Data certified non valida per il conto %', p_account_id;
  END IF;
  IF EXISTS (SELECT 1 FROM public.account_balance_checkpoints c WHERE c.account_id = p_account_id AND (
    c.as_of_date IS NULL OR NOT pg_catalog.isfinite(c.as_of_date) OR c.amount IS NULL
    OR c.amount::text IN ('NaN', 'Infinity', '-Infinity') OR c.checkpoint_type IS NULL
    OR c.checkpoint_type NOT IN ('certified', 'derived')
    OR c.as_of_date <> (date_trunc('month', c.as_of_date::timestamp) + interval '1 month' - interval '1 day')::date
    OR (c.checkpoint_type = 'derived' AND (c.as_of_date <= v_certified_date OR c.as_of_date >= v_current_month)))) THEN
    RAISE EXCEPTION 'Struttura checkpoint non valida per il conto %', p_account_id;
  END IF;
  IF EXISTS (SELECT 1 FROM public.transactions t WHERE t.account_id = p_account_id AND (
    t.date IS NULL OR NOT pg_catalog.isfinite(t.date) OR t.date > v_today OR t.amount IS NULL
    OR t.amount::text IN ('NaN', 'Infinity', '-Infinity') OR t.created_at IS NULL)) THEN
    RAISE EXCEPTION 'Movimenti non validi o futuri nel conto %', p_account_id;
  END IF;
  RETURN v_certified_date;
END;
$$;

-- Validate derived cache against the authoritative certified plus actual amounts.
-- Missing months (including empty months) and corrupted values are both detected.
CREATE FUNCTION public._balance_first_invalid_month(p_account_id text)
RETURNS date LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  v_certified_date date; v_amount numeric; v_invalid date;
  v_current_month date := date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Rome')::date;
BEGIN
  v_certified_date := public._balance_validate_account(p_account_id);
  SELECT c.amount INTO STRICT v_amount FROM public.account_balance_checkpoints c
    WHERE c.account_id = p_account_id AND c.checkpoint_type = 'certified';
  WITH months AS (
    SELECT g.month_start::date AS month_start,
      (g.month_start + interval '1 month' - interval '1 day')::date AS month_end
    FROM pg_catalog.generate_series((v_certified_date + 1)::timestamp,
      (v_current_month - interval '1 month')::timestamp, interval '1 month') g(month_start)
  ), totals AS (
    SELECT date_trunc('month', t.date::timestamp)::date AS month_start, sum(t.amount) AS month_amount
    FROM public.transactions t WHERE t.account_id = p_account_id
      AND t.date > v_certified_date AND t.date < v_current_month
    GROUP BY date_trunc('month', t.date::timestamp)::date
  ), expected AS (
    SELECT m.month_start, m.month_end,
      v_amount + sum(coalesce(t.month_amount, 0::numeric)) OVER (
        ORDER BY m.month_start ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS expected_amount
    FROM months m LEFT JOIN totals t ON t.month_start = m.month_start
  )
  SELECT e.month_start INTO v_invalid FROM expected e
    LEFT JOIN public.account_balance_checkpoints c ON c.account_id = p_account_id AND c.as_of_date = e.month_end
    WHERE c.id IS NULL OR c.checkpoint_type IS DISTINCT FROM 'derived' OR c.amount IS DISTINCT FROM e.expected_amount
    ORDER BY e.month_start LIMIT 1;
  RETURN v_invalid;
END;
$$;

CREATE FUNCTION public._balance_rebuild(p_account_id text, p_affected_date date)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  v_certified_date date; v_base public.account_balance_checkpoints%ROWTYPE;
  v_today date := (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Rome')::date;
  v_current_month date := date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Rome')::date;
  v_requested date; v_invalid date; v_effective date; v_month date; v_next date;
  v_running numeric; v_total numeric; v_rows bigint; v_updates bigint := 0; v_checkpoints bigint := 0;
BEGIN
  PERFORM public._balance_engine_lock();
  v_certified_date := public._balance_validate_account(p_account_id);
  IF p_affected_date IS NULL OR NOT pg_catalog.isfinite(p_affected_date) THEN RAISE EXCEPTION 'Data interessata non valida'; END IF;
  IF p_affected_date <= v_certified_date THEN RAISE EXCEPTION 'Mutazione nel periodo certified del conto %', p_account_id; END IF;
  IF p_affected_date > v_today THEN RAISE EXCEPTION 'Mutazione con data futura'; END IF;
  v_requested := date_trunc('month', p_affected_date::timestamp)::date;
  v_invalid := public._balance_first_invalid_month(p_account_id);
  v_effective := v_requested;
  IF v_invalid IS NOT NULL AND v_invalid < v_effective THEN v_effective := v_invalid; END IF;
  SELECT c.* INTO v_base FROM public.account_balance_checkpoints c
    WHERE c.account_id = p_account_id AND c.as_of_date >= v_certified_date AND c.as_of_date < v_effective
    ORDER BY c.as_of_date DESC LIMIT 1;
  IF NOT FOUND THEN RAISE EXCEPTION 'Nessuna base valida precedente al mese % per %', v_effective, p_account_id; END IF;
  IF v_base.as_of_date <> v_effective - 1 THEN RAISE EXCEPTION 'Continuità checkpoint non garantita per %', p_account_id; END IF;
  v_running := v_base.amount; v_month := v_effective;
  WHILE v_month <= v_current_month LOOP
    v_next := (v_month + interval '1 month')::date;
    WITH calculated AS (
      SELECT t.id, v_running + sum(t.amount) OVER (
        ORDER BY t.date, t.created_at, t.id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS expected_balance
      FROM public.transactions t WHERE t.account_id = p_account_id AND t.date >= v_month AND t.date < v_next
    )
    UPDATE public.transactions t SET balance = c.expected_balance FROM calculated c
      WHERE t.id = c.id AND t.balance IS DISTINCT FROM c.expected_balance;
    GET DIAGNOSTICS v_rows = ROW_COUNT; v_updates := v_updates + v_rows;
    SELECT sum(t.amount) INTO v_total FROM public.transactions t
      WHERE t.account_id = p_account_id AND t.date >= v_month AND t.date < v_next;
    -- Empty period: keep the real opening balance. Never substitute a missing base.
    IF v_total IS NOT NULL THEN v_running := v_running + v_total; END IF;
    IF v_month < v_current_month THEN
      INSERT INTO public.account_balance_checkpoints AS target (account_id, as_of_date, amount, checkpoint_type, created_at)
      VALUES (p_account_id, v_next - 1, v_running, 'derived', CURRENT_TIMESTAMP)
      ON CONFLICT (account_id, as_of_date) DO UPDATE SET amount = EXCLUDED.amount
        WHERE target.checkpoint_type = 'derived' AND target.amount IS DISTINCT FROM EXCLUDED.amount;
      GET DIAGNOSTICS v_rows = ROW_COUNT; v_checkpoints := v_checkpoints + v_rows;
    END IF;
    v_month := v_next;
  END LOOP;
  RETURN jsonb_build_object('account_id', p_account_id, 'requested_month', v_requested,
    'first_invalid_cache_month', v_invalid, 'effective_month', v_effective,
    'base_date', v_base.as_of_date, 'base_amount', v_base.amount,
    'balance_updates', v_updates, 'checkpoint_writes', v_checkpoints, 'current_balance', v_running);
END;
$$;

CREATE FUNCTION public.ensure_balance_checkpoints(p_account_id text)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_invalid date;
BEGIN
  PERFORM public._balance_assert_authenticated(); PERFORM public._balance_engine_lock();
  v_invalid := public._balance_first_invalid_month(p_account_id);
  IF v_invalid IS NULL THEN RETURN jsonb_build_object('account_id', p_account_id,
    'rebuilt', false, 'reason', 'completed_months_verified'); END IF;
  RETURN public._balance_rebuild(p_account_id, v_invalid) || jsonb_build_object('rebuilt', true);
END;
$$;

CREATE FUNCTION public._balance_sync_tags(p_transaction_id bigint, p_tag_ids jsonb)
RETURNS bigint LANGUAGE plpgsql VOLATILE SECURITY INVOKER SET search_path = '' AS $$
DECLARE v_ids bigint[]; v_rows bigint; v_changes bigint := 0;
BEGIN
  IF p_tag_ids IS NULL THEN RETURN 0; END IF;
  IF jsonb_typeof(p_tag_ids) <> 'array' THEN RAISE EXCEPTION 'p_tag_ids deve essere un array JSON'; END IF;
  IF EXISTS (SELECT 1 FROM jsonb_array_elements(p_tag_ids) e(value)
    WHERE jsonb_typeof(e.value) NOT IN ('string', 'number')) THEN RAISE EXCEPTION 'Ogni tag_id deve essere una stringa o un numero intero'; END IF;
  SELECT coalesce(array_agg(DISTINCT (e.value #>> '{}')::bigint), ARRAY[]::bigint[])
    INTO v_ids FROM jsonb_array_elements(p_tag_ids) e(value);
  IF EXISTS (SELECT 1 FROM unnest(v_ids) wanted(tag_id)
    WHERE NOT EXISTS (SELECT 1 FROM public.tags t WHERE t.id = wanted.tag_id)) THEN RAISE EXCEPTION 'Uno o più Tag non esistono'; END IF;
  DELETE FROM public.transaction_tags a WHERE a.transaction_id = p_transaction_id AND NOT (a.tag_id = ANY(v_ids));
  GET DIAGNOSTICS v_rows = ROW_COUNT; v_changes := v_changes + v_rows;
  INSERT INTO public.transaction_tags(transaction_id, tag_id)
    SELECT p_transaction_id, wanted.tag_id FROM unnest(v_ids) wanted(tag_id)
    WHERE NOT EXISTS (SELECT 1 FROM public.transaction_tags a WHERE a.transaction_id = p_transaction_id AND a.tag_id = wanted.tag_id)
    ON CONFLICT (transaction_id, tag_id) DO NOTHING;
  GET DIAGNOSTICS v_rows = ROW_COUNT; v_changes := v_changes + v_rows;
  RETURN v_changes;
END;
$$;

CREATE FUNCTION public.save_transaction(p_operation text, p_tx_id text, p_date date,
  p_description text, p_amount numeric, p_account_id text, p_in_totals boolean, p_tag_ids jsonb DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_old public.transactions%ROWTYPE; v_saved public.transactions%ROWTYPE;
  v_financial boolean; v_metadata boolean := false; v_certified_date date; v_tag_changes bigint;
  v_rebuilds jsonb := '[]'::jsonb;
  v_today date := (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Rome')::date;
BEGIN
  PERFORM public._balance_assert_authenticated(); PERFORM public._balance_engine_lock();
  IF p_operation IS NULL OR p_operation NOT IN ('insert', 'update') THEN RAISE EXCEPTION 'p_operation deve essere insert oppure update'; END IF;
  IF p_tx_id IS NULL OR btrim(p_tx_id) = '' THEN RAISE EXCEPTION 'tx_id obbligatorio'; END IF;
  IF p_date IS NULL OR NOT pg_catalog.isfinite(p_date) OR p_amount IS NULL
    OR p_account_id IS NULL OR btrim(p_account_id) = '' THEN RAISE EXCEPTION 'date, amount e account_id non validi'; END IF;
  IF p_amount::text IN ('NaN', 'Infinity', '-Infinity') THEN RAISE EXCEPTION 'Importo non finito'; END IF;
  IF p_operation = 'insert' THEN
    IF EXISTS (SELECT 1 FROM public.transactions t WHERE t.tx_id = p_tx_id) THEN
      RAISE EXCEPTION 'tx_id già esistente: %', p_tx_id USING ERRCODE = '23505'; END IF;
    v_financial := true;
  ELSE
    SELECT t.* INTO v_old FROM public.transactions t WHERE t.tx_id = p_tx_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Movimento non trovato: %', p_tx_id; END IF;
    v_financial := v_old.amount IS DISTINCT FROM p_amount OR v_old.date IS DISTINCT FROM p_date OR v_old.account_id IS DISTINCT FROM p_account_id;
    v_metadata := v_old.description IS DISTINCT FROM p_description OR v_old.in_totals IS DISTINCT FROM p_in_totals;
  END IF;
  IF v_financial THEN
    IF p_date > v_today THEN RAISE EXCEPTION 'Movimenti futuri non ammessi'; END IF;
    v_certified_date := public._balance_validate_account(p_account_id);
    IF p_date <= v_certified_date THEN RAISE EXCEPTION 'Nuova data dentro o prima del periodo certified'; END IF;
    IF p_operation = 'update' THEN
      v_certified_date := public._balance_validate_account(v_old.account_id);
      IF v_old.date <= v_certified_date THEN RAISE EXCEPTION 'Movimento originario nel periodo certified'; END IF;
    END IF;
  END IF;
  IF p_operation = 'insert' THEN
    INSERT INTO public.transactions(tx_id, date, description, amount, account_id, in_totals, balance)
      VALUES(p_tx_id, p_date, p_description, p_amount, p_account_id, p_in_totals, NULL) RETURNING * INTO v_saved;
  ELSIF v_financial OR v_metadata THEN
    UPDATE public.transactions t SET date = p_date, description = p_description, amount = p_amount,
      account_id = p_account_id, in_totals = p_in_totals WHERE t.id = v_old.id RETURNING t.* INTO v_saved;
  ELSE v_saved := v_old;
  END IF;
  v_tag_changes := public._balance_sync_tags(v_saved.id, p_tag_ids);
  IF v_financial THEN
    IF p_operation = 'insert' THEN v_rebuilds := jsonb_build_array(public._balance_rebuild(p_account_id, p_date));
    ELSIF v_old.account_id = p_account_id THEN
      v_rebuilds := jsonb_build_array(public._balance_rebuild(p_account_id, least(v_old.date, p_date)));
    ELSE v_rebuilds := jsonb_build_array(public._balance_rebuild(v_old.account_id, v_old.date), public._balance_rebuild(p_account_id, p_date));
    END IF;
    SELECT t.* INTO STRICT v_saved FROM public.transactions t WHERE t.id = v_saved.id;
  END IF;
  RETURN jsonb_build_object('operation', p_operation, 'financial_changed', v_financial, 'metadata_changed', v_metadata,
    'tag_changes', v_tag_changes, 'transaction', to_jsonb(v_saved), 'rebuilds', v_rebuilds);
END;
$$;

CREATE FUNCTION public.delete_transaction(p_tx_id text)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_old public.transactions%ROWTYPE; v_certified_date date; v_result jsonb;
BEGIN
  PERFORM public._balance_assert_authenticated(); PERFORM public._balance_engine_lock();
  IF p_tx_id IS NULL OR btrim(p_tx_id) = '' THEN RAISE EXCEPTION 'tx_id obbligatorio'; END IF;
  SELECT t.* INTO v_old FROM public.transactions t WHERE t.tx_id = p_tx_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Movimento non trovato: %', p_tx_id; END IF;
  v_certified_date := public._balance_validate_account(v_old.account_id);
  IF v_old.date <= v_certified_date THEN RAISE EXCEPTION 'Cancellazione dentro o prima del periodo certified'; END IF;
  DELETE FROM public.transactions t WHERE t.id = v_old.id;
  v_result := public._balance_rebuild(v_old.account_id, v_old.date);
  RETURN jsonb_build_object('deleted_tx_id', v_old.tx_id, 'deleted_id', v_old.id, 'account_id', v_old.account_id, 'rebuild', v_result);
END;
$$;

CREATE FUNCTION public.get_account_balance(p_account_id text)
RETURNS numeric LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_certified_date date; v_amount numeric; v_total numeric;
  v_today date := (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Rome')::date;
BEGIN
  PERFORM public._balance_assert_authenticated();
  v_certified_date := public._balance_validate_account(p_account_id);
  SELECT c.amount INTO STRICT v_amount FROM public.account_balance_checkpoints c
    WHERE c.account_id = p_account_id AND c.checkpoint_type = 'certified';
  SELECT sum(t.amount) INTO v_total FROM public.transactions t
    WHERE t.account_id = p_account_id AND t.date > v_certified_date AND t.date <= v_today;
  IF v_total IS NULL THEN RETURN v_amount; END IF;
  RETURN v_amount + v_total;
END;
$$;

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
COMMIT;

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
