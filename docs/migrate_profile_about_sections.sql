-- Backfill existing single bio into the new 4-section profile narrative structure.
-- This does NOT remove or overwrite bio; it only hydrates aiInsights.aboutSections when missing.

UPDATE public.profiles
SET "aiInsights" = jsonb_set(
  COALESCE("aiInsights", '{}'::jsonb),
  '{aboutSections}',
  jsonb_build_object(
    'whoIHelp',
    COALESCE("aiInsights"->'aboutSections'->>'whoIHelp', ''),
    'whatISpecializeIn',
    COALESCE(NULLIF("aiInsights"->'aboutSections'->>'whatISpecializeIn', ''), COALESCE(bio, '')),
    'resultsIHaveDelivered',
    COALESCE("aiInsights"->'aboutSections'->>'resultsIHaveDelivered', ''),
    'howIWork',
    COALESCE("aiInsights"->'aboutSections'->>'howIWork', '')
  ),
  true
)
WHERE COALESCE("aiInsights"->'aboutSections'->>'whatISpecializeIn', '') = ''
  OR "aiInsights"->'aboutSections' IS NULL;
