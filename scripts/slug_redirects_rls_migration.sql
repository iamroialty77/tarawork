-- Security hardening for a PostgREST-exposed internal redirect table.
-- No client policies are intentionally created: anon/authenticated access is denied.
-- Trusted server code using the Supabase service role continues to bypass RLS.
ALTER TABLE IF EXISTS public.slug_redirects ENABLE ROW LEVEL SECURITY;
