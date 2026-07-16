-- TaraWork SMTP message log
-- Run this in Supabase SQL Editor so admins can view SMTP messages inside the app.

CREATE TABLE IF NOT EXISTS public.email_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'inbound',
  from_email TEXT,
  from_name TEXT,
  to_email TEXT,
  reply_to TEXT,
  subject TEXT NOT NULL,
  text_body TEXT NOT NULL,
  html_body TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  related_table TEXT,
  related_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.email_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage email messages." ON public.email_messages;
CREATE POLICY "Admins can manage email messages." ON public.email_messages
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

CREATE INDEX IF NOT EXISTS email_messages_created_at_idx
  ON public.email_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS email_messages_type_created_at_idx
  ON public.email_messages (type, created_at DESC);

CREATE INDEX IF NOT EXISTS email_messages_from_email_idx
  ON public.email_messages (from_email);
