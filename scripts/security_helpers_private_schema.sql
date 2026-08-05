BEGIN;

-- RLS helpers belong outside schemas exposed through PostgREST.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

ALTER FUNCTION public.has_admin_permission(text) SET SCHEMA private;
ALTER FUNCTION public.is_project_member(uuid) SET SCHEMA private;
ALTER FUNCTION public.is_staff(text[]) SET SCHEMA private;

REVOKE ALL ON FUNCTION private.has_admin_permission(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_admin_permission(text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION private.is_project_member(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_project_member(uuid) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION private.is_staff(text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_staff(text[]) TO anon, authenticated, service_role;

COMMIT;
