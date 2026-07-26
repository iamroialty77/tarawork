-- Run once in Supabase Dashboard > SQL Editor.
-- These indexes keep automation recipient, cooldown, and application checks fast
-- as the message and application history grows.

create index if not exists idx_email_messages_automation_lookup
  on public.email_messages (type, status, created_at desc);

create index if not exists idx_email_messages_type_created
  on public.email_messages (type, created_at desc);

create index if not exists idx_applications_job_freelancer
  on public.applications (job_id, freelancer_id);

create index if not exists idx_portfolio_items_profile
  on public.portfolio_items (profile_id);

create index if not exists idx_portfolios_profile
  on public.portfolios (profile_id);

analyze public.email_messages;
analyze public.applications;
analyze public.portfolio_items;
analyze public.portfolios;
