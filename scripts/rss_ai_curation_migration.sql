-- RSS AI-curation metadata and admin thresholds.
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS semantic_fingerprint TEXT,
  ADD COLUMN IF NOT EXISTS location_label TEXT,
  ADD COLUMN IF NOT EXISTS location_eligible BOOLEAN,
  ADD COLUMN IF NOT EXISTS quality_score SMALLINT CHECK (quality_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS scam_risk_score SMALLINT CHECK (scam_risk_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS scam_risk_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS seniority_tag TEXT,
  ADD COLUMN IF NOT EXISTS salary_estimated BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS salary_estimate_min INTEGER,
  ADD COLUMN IF NOT EXISTS salary_estimate_max INTEGER,
  ADD COLUMN IF NOT EXISTS salary_estimate_currency TEXT,
  ADD COLUMN IF NOT EXISTS curation_status TEXT NOT NULL DEFAULT 'unreviewed' CHECK (curation_status IN ('unreviewed','curated','rejected')),
  ADD COLUMN IF NOT EXISTS curated_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS jobs_rss_semantic_fingerprint_unique
  ON public.jobs (semantic_fingerprint)
  WHERE source = 'rss' AND semantic_fingerprint IS NOT NULL;
CREATE INDEX IF NOT EXISTS jobs_rss_curation_rank_idx
  ON public.jobs (quality_score DESC, scam_risk_score ASC, published_at DESC)
  WHERE source = 'rss' AND status = 'live' AND curation_status = 'curated';

ALTER TABLE public.rss_automation_configs
  ADD COLUMN IF NOT EXISTS minimum_quality_score SMALLINT NOT NULL DEFAULT 55 CHECK (minimum_quality_score BETWEEN 30 AND 90),
  ADD COLUMN IF NOT EXISTS maximum_scam_risk_score SMALLINT NOT NULL DEFAULT 35 CHECK (maximum_scam_risk_score BETWEEN 0 AND 80),
  ADD COLUMN IF NOT EXISTS exclude_us_only BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS use_local_ai BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS closed_retention_days SMALLINT NOT NULL DEFAULT 30 CHECK (closed_retention_days BETWEEN 7 AND 90),
  ADD COLUMN IF NOT EXISTS maximum_stored_jobs INTEGER NOT NULL DEFAULT 2000 CHECK (maximum_stored_jobs BETWEEN 500 AND 5000);

ALTER TABLE public.rss_automation_runs
  ADD COLUMN IF NOT EXISTS rejected_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_processed_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_fallback_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deleted_count INTEGER NOT NULL DEFAULT 0;
