-- Ensure admin role is supported and enforced in profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'freelancer';

-- Normalize existing/legacy role values before adding strict constraint
UPDATE public.profiles
SET role = CASE
  WHEN role IS NULL OR btrim(role) = '' THEN 'freelancer'
  WHEN lower(btrim(role)) IN ('freelancer', 'freelance') THEN 'freelancer'
  WHEN lower(btrim(role)) IN ('employer', 'client', 'hirer') THEN 'employer'
  WHEN lower(btrim(role)) = 'admin' THEN 'admin'
  ELSE 'freelancer'
END;

-- Recreate constraint safely (in case an old variant already exists)
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('freelancer', 'employer', 'admin'))
  NOT VALID;

ALTER TABLE public.profiles
  VALIDATE CONSTRAINT profiles_role_check;

-- Example: promote a specific user to admin
-- UPDATE public.profiles SET role = 'admin' WHERE id = '<user-uuid>';
