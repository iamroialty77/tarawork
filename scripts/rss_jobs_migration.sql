-- Run once in the Supabase SQL editor before enabling the RSS cron.
ALTER TABLE public.jobs
    ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'client',
    ADD COLUMN IF NOT EXISTS source_feed TEXT,
    ADD COLUMN IF NOT EXISTS external_url TEXT,
    ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

CREATE UNIQUE INDEX IF NOT EXISTS jobs_external_url_unique
    ON public.jobs (external_url)
    WHERE external_url IS NOT NULL;

CREATE INDEX IF NOT EXISTS jobs_rss_expiry_idx
    ON public.jobs (expires_at)
    WHERE source = 'rss' AND status = 'live';
