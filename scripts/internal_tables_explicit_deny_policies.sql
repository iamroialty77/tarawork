BEGIN;

-- These tables are intentionally server-only. Explicit deny policies document
-- that design and keep anon/authenticated access closed while service-role code
-- continues to bypass RLS.
DO $migration$
DECLARE
  table_name text;
  policy_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'paymongo_checkout_sessions',
    'paymongo_events',
    'seo_integrations',
    'slug_redirects',
    'users'
  ]
  LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      policy_name := format('Deny client access to %s', table_name);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, table_name);
      EXECUTE format(
        'CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)',
        policy_name,
        table_name
      );
    END IF;
  END LOOP;
END
$migration$;

COMMIT;
