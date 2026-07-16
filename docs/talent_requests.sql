-- TaraWork employer lead capture table
-- Run this in Supabase SQL Editor to store "Get Free Talent Shortlist" requests.

CREATE TABLE IF NOT EXISTS public.talent_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  role_needed TEXT NOT NULL,
  budget TEXT,
  hours_per_week TEXT,
  start_date TEXT,
  notes TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT NOT NULL DEFAULT 'hire_request_page',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.talent_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage talent requests." ON public.talent_requests;
CREATE POLICY "Admins can manage talent requests." ON public.talent_requests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS talent_requests_status_created_at_idx
  ON public.talent_requests (status, created_at DESC);

CREATE INDEX IF NOT EXISTS talent_requests_email_idx
  ON public.talent_requests (email);
