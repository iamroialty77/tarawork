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

CREATE TABLE IF NOT EXISTS public.rss_automation_configs (
    id TEXT PRIMARY KEY DEFAULT 'primary' CHECK (id = 'primary'),
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    expiry_days INTEGER NOT NULL DEFAULT 21 CHECK (expiry_days BETWEEN 14 AND 30),
    feeds JSONB NOT NULL DEFAULT '[{"name":"Himalayas","url":"https://himalayas.app/jobs/rss"},{"name":"Remote OK","url":"https://remoteok.com/remote-jobs.rss"}]'::jsonb,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.rss_automation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trigger_type TEXT NOT NULL CHECK (trigger_type IN ('manual', 'cron')),
    status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
    inserted_count INTEGER NOT NULL DEFAULT 0,
    duplicate_count INTEGER NOT NULL DEFAULT 0,
    expired_count INTEGER NOT NULL DEFAULT 0,
    errors JSONB NOT NULL DEFAULT '[]'::jsonb,
    started_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS rss_automation_runs_started_at_idx ON public.rss_automation_runs (started_at DESC);
ALTER TABLE public.rss_automation_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rss_automation_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage RSS automation configs." ON public.rss_automation_configs;
CREATE POLICY "Admins can manage RSS automation configs." ON public.rss_automation_configs FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can view RSS automation runs." ON public.rss_automation_runs;
CREATE POLICY "Admins can view RSS automation runs." ON public.rss_automation_runs FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
