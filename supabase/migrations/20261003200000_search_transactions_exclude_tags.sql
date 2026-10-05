-- Replace the old signature to avoid ambiguous default-argument overloads.
DROP FUNCTION public.search_transactions(bigint[], date, date, text, numeric, numeric, text, boolean, text, text, integer, integer);

CREATE OR REPLACE FUNCTION public.search_transactions(
  p_tag_ids bigint[] DEFAULT NULL::bigint[],
  p_date_from date DEFAULT NULL::date,
  p_date_to date DEFAULT NULL::date,
  p_description text DEFAULT NULL::text,
  p_amount_from numeric DEFAULT NULL::numeric,
  p_amount_to numeric DEFAULT NULL::numeric,
  p_movement_type text DEFAULT 'all'::text,
  p_in_totals boolean DEFAULT NULL::boolean,
  p_tag_presence text DEFAULT 'all'::text,
  p_sort text DEFAULT 'date_desc'::text,
  p_page integer DEFAULT 1,
  p_page_size integer DEFAULT 50,
  p_exclude_tag_ids bigint[] DEFAULT NULL::bigint[]
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  v_description text;
  v_description_pattern text;
  v_has_tag_filter boolean;
  v_tag_presence text;
  v_offset bigint;
  v_result jsonb;
BEGIN
  IF p_movement_type IS NULL
     OR p_movement_type NOT IN ('all', 'income', 'expense')
  THEN
    RAISE EXCEPTION USING
      ERRCODE = '22023',
      MESSAGE = 'p_movement_type deve essere all, income oppure expense';
  END IF;

  IF p_tag_presence IS NULL
     OR p_tag_presence NOT IN ('all', 'with_tags', 'without_tags')
  THEN
    RAISE EXCEPTION USING
      ERRCODE = '22023',
      MESSAGE = 'p_tag_presence deve essere all, with_tags oppure without_tags';
  END IF;

  IF p_sort IS NULL
     OR p_sort NOT IN (
       'date_desc', 'date_asc', 'amount_desc', 'amount_asc'
     )
  THEN
    RAISE EXCEPTION USING
      ERRCODE = '22023',
      MESSAGE = 'p_sort non valido';
  END IF;

  IF p_date_from IS NOT NULL
     AND p_date_to IS NOT NULL
     AND p_date_from > p_date_to
  THEN
    RAISE EXCEPTION USING
      ERRCODE = '22023',
      MESSAGE = 'p_date_from deve essere minore o uguale a p_date_to';
  END IF;

  IF p_amount_from IS NOT NULL THEN
    IF p_amount_from::text IN ('NaN', 'Infinity', '-Infinity')
       OR p_amount_from < 0
    THEN
      RAISE EXCEPTION USING
        ERRCODE = '22023',
        MESSAGE = 'p_amount_from deve essere un numero finito maggiore o uguale a 0';
    END IF;
  END IF;

  IF p_amount_to IS NOT NULL THEN
    IF p_amount_to::text IN ('NaN', 'Infinity', '-Infinity')
       OR p_amount_to < 0
    THEN
      RAISE EXCEPTION USING
        ERRCODE = '22023',
        MESSAGE = 'p_amount_to deve essere un numero finito maggiore o uguale a 0';
    END IF;
  END IF;

  IF p_amount_from IS NOT NULL
     AND p_amount_to IS NOT NULL
     AND p_amount_from > p_amount_to
  THEN
    RAISE EXCEPTION USING
      ERRCODE = '22023',
      MESSAGE = 'p_amount_from deve essere minore o uguale a p_amount_to';
  END IF;

  IF p_page IS NULL OR p_page < 1 THEN
    RAISE EXCEPTION USING
      ERRCODE = '22023',
      MESSAGE = 'p_page deve essere maggiore o uguale a 1';
  END IF;

  IF p_page_size IS NULL OR p_page_size NOT BETWEEN 1 AND 200 THEN
    RAISE EXCEPTION USING
      ERRCODE = '22023',
      MESSAGE = 'p_page_size deve essere compreso tra 1 e 200';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_catalog.unnest(p_tag_ids) AS selected_tag(id)
    WHERE selected_tag.id IS NULL OR selected_tag.id <= 0
  ) THEN
    RAISE EXCEPTION USING
      ERRCODE = '22023',
      MESSAGE = 'p_tag_ids deve contenere soltanto ID positivi non NULL';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_catalog.unnest(p_exclude_tag_ids) AS selected_tag(id)
    WHERE selected_tag.id IS NULL OR selected_tag.id <= 0
  ) THEN
    RAISE EXCEPTION USING
      ERRCODE = '22023',
      MESSAGE = 'p_exclude_tag_ids deve contenere soltanto ID positivi non NULL';
  END IF;

  v_has_tag_filter := COALESCE(
    pg_catalog.cardinality(p_tag_ids), 0
  ) > 0;

  IF v_has_tag_filter AND p_tag_presence = 'without_tags' THEN
    RAISE EXCEPTION USING
      ERRCODE = '22023',
      MESSAGE = 'Tag specifici e without_tags sono filtri incompatibili';
  END IF;

  v_tag_presence := CASE
    WHEN v_has_tag_filter THEN 'with_tags'
    ELSE p_tag_presence
  END;

  v_description := NULLIF(
    pg_catalog.regexp_replace(
      p_description,
      '^[[:space:]]+|[[:space:]]+$',
      '',
      'g'
    ),
    ''
  );

  IF v_description IS NOT NULL THEN
    v_description_pattern :=
      '%' ||
      pg_catalog.replace(
        pg_catalog.replace(
          pg_catalog.replace(v_description, '!', '!!'),
          '%', '!%'
        ),
        '_', '!_'
      ) ||
      '%';
  END IF;

  v_offset := (p_page::bigint - 1) * p_page_size::bigint;

  WITH filtered AS MATERIALIZED (
    SELECT
      t.id,
      t.tx_id,
      t.date,
      t.description,
      t.amount,
      t.balance,
      t.in_totals
    FROM public.transactions AS t
    WHERE
      (p_date_from IS NULL OR t.date >= p_date_from)
      AND (p_date_to IS NULL OR t.date <= p_date_to)

      AND (
        v_description_pattern IS NULL
        OR t.description ILIKE v_description_pattern ESCAPE '!'
      )

      AND (
        p_amount_from IS NULL
        OR pg_catalog.abs(t.amount) >= p_amount_from
      )
      AND (
        p_amount_to IS NULL
        OR pg_catalog.abs(t.amount) <= p_amount_to
      )

      AND (
        p_movement_type = 'all'
        OR (p_movement_type = 'income' AND t.amount > 0)
        OR (p_movement_type = 'expense' AND t.amount < 0)
      )

      AND (
        p_in_totals IS NULL
        OR t.in_totals = p_in_totals
      )

      AND (
        NOT v_has_tag_filter
        OR EXISTS (
          SELECT 1
          FROM public.transaction_tags AS tt
          WHERE tt.transaction_id = t.id
            AND tt.tag_id = ANY (p_tag_ids)
        )
      )

      AND NOT EXISTS (
        SELECT 1
        FROM public.transaction_tags AS excluded_tt
        WHERE excluded_tt.transaction_id = t.id
          AND excluded_tt.tag_id = ANY (p_exclude_tag_ids)
      )

      AND (
        v_tag_presence = 'all'
        OR (
          v_tag_presence = 'with_tags'
          AND EXISTS (
            SELECT 1
            FROM public.transaction_tags AS tt
            WHERE tt.transaction_id = t.id
          )
        )
        OR (
          v_tag_presence = 'without_tags'
          AND NOT EXISTS (
            SELECT 1
            FROM public.transaction_tags AS tt
            WHERE tt.transaction_id = t.id
          )
        )
      )
  ),

  totals AS (
    SELECT
      pg_catalog.count(*) AS total_count,
      COALESCE(
        pg_catalog.sum(f.amount) FILTER (WHERE f.amount > 0),
        0::numeric
      ) AS income,
      COALESCE(
        pg_catalog.sum(f.amount) FILTER (WHERE f.amount < 0),
        0::numeric
      ) AS expense,
      COALESCE(
        pg_catalog.sum(f.amount),
        0::numeric
      ) AS net
    FROM filtered AS f
  ),

  page_rows AS MATERIALIZED (
    SELECT f.*
    FROM filtered AS f
    ORDER BY
      CASE WHEN p_sort = 'date_desc'
        THEN f.date END DESC NULLS LAST,
      CASE WHEN p_sort = 'date_asc'
        THEN f.date END ASC NULLS LAST,

      CASE WHEN p_sort = 'amount_desc'
        THEN pg_catalog.abs(f.amount) END DESC NULLS LAST,
      CASE WHEN p_sort = 'amount_asc'
        THEN pg_catalog.abs(f.amount) END ASC NULLS LAST,

      CASE WHEN p_sort IN ('amount_desc', 'amount_asc')
        THEN f.date END DESC NULLS LAST,

      CASE WHEN p_sort = 'date_asc'
        THEN f.id END ASC,
      CASE WHEN p_sort <> 'date_asc'
        THEN f.id END DESC

    LIMIT p_page_size
    OFFSET v_offset
  ),

  page_items AS (
    SELECT COALESCE(
      pg_catalog.jsonb_agg(
        pg_catalog.jsonb_build_object(
          'id', p.id,
          'tx_id', p.tx_id,
          'date', p.date,
          'description', p.description,
          'amount', p.amount,
          'balance', p.balance,
          'in_totals', p.in_totals,
          'tags', tag_data.tags
        )
        ORDER BY
          CASE WHEN p_sort = 'date_desc'
            THEN p.date END DESC NULLS LAST,
          CASE WHEN p_sort = 'date_asc'
            THEN p.date END ASC NULLS LAST,

          CASE WHEN p_sort = 'amount_desc'
            THEN pg_catalog.abs(p.amount) END DESC NULLS LAST,
          CASE WHEN p_sort = 'amount_asc'
            THEN pg_catalog.abs(p.amount) END ASC NULLS LAST,

          CASE WHEN p_sort IN ('amount_desc', 'amount_asc')
            THEN p.date END DESC NULLS LAST,

          CASE WHEN p_sort = 'date_asc'
            THEN p.id END ASC,
          CASE WHEN p_sort <> 'date_asc'
            THEN p.id END DESC
      ),
      '[]'::jsonb
    ) AS items
    FROM page_rows AS p
    CROSS JOIN LATERAL (
      SELECT COALESCE(
        pg_catalog.jsonb_agg(
          pg_catalog.jsonb_build_object(
            'id', tag.id,
            'name', tag.name,
            'color', tag.color
          )
          ORDER BY tag.name NULLS LAST, tag.id
        ),
        '[]'::jsonb
      ) AS tags
      FROM public.transaction_tags AS tt
      JOIN public.tags AS tag
        ON tag.id = tt.tag_id
      WHERE tt.transaction_id = p.id
    ) AS tag_data
  ),

  pagination_data AS (
    SELECT
      totals.*,
      (
        total_count / p_page_size::bigint
        + CASE
            WHEN total_count % p_page_size::bigint > 0 THEN 1
            ELSE 0
          END
      ) AS total_pages
    FROM totals
  )

  SELECT pg_catalog.jsonb_build_object(
    'summary', pg_catalog.jsonb_build_object(
      'count', meta.total_count,
      'income', meta.income,
      'expense', meta.expense,
      'net', meta.net
    ),
    'items', page_items.items,
    'pagination', pg_catalog.jsonb_build_object(
      'page', p_page,
      'page_size', p_page_size,
      'total_pages', meta.total_pages,
      'has_previous', p_page > 1 AND meta.total_pages > 0,
      'has_next', p_page::bigint < meta.total_pages
    )
  )
  INTO v_result
  FROM pagination_data AS meta
  CROSS JOIN page_items;

  RETURN v_result;
END;
$function$;

REVOKE ALL ON FUNCTION public.search_transactions(bigint[], date, date, text, numeric, numeric, text, boolean, text, text, integer, integer, bigint[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_transactions(bigint[], date, date, text, numeric, numeric, text, boolean, text, text, integer, integer, bigint[]) TO authenticated;
