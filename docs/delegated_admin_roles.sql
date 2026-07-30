-- Granular admin access. Run once in the Supabase SQL editor.
-- Fix legacy role-escalation trigger so protected server routes can promote users.
CREATE OR REPLACE FUNCTION public.prevent_profile_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_is_admin BOOLEAN;
BEGIN
  -- Supabase service-role requests bypass user-level role protection.
  IF auth.role() = 'service_role'
     OR COALESCE(auth.jwt()->>'role', '') = 'service_role'
     OR current_user IN ('postgres', 'supabase_admin', 'service_role') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.role = 'admin' THEN
      NEW.role := 'freelancer';
    ELSIF NEW.role NOT IN ('freelancer', 'employer', 'client') THEN
      NEW.role := 'freelancer';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role THEN
    SELECT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) INTO requester_is_admin;

    IF NOT COALESCE(requester_is_admin, FALSE) THEN
      NEW.role := OLD.role;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.delegated_admins (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  base_role TEXT NOT NULL CHECK (base_role IN ('freelancer', 'employer')),
  permissions TEXT[] NOT NULL DEFAULT '{}',
  is_owner BOOLEAN NOT NULL DEFAULT FALSE,
  granted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.delegated_admins ENABLE ROW LEVEL SECURITY;

-- Existing admins become owners so an upgrade never locks out the current team.
INSERT INTO public.delegated_admins (user_id, base_role, permissions, is_owner, granted_by)
SELECT id, 'freelancer', '{}', TRUE, id
FROM public.profiles
WHERE role = 'admin'
ON CONFLICT (user_id) DO NOTHING;

DROP POLICY IF EXISTS "Admins can view their delegated access" ON public.delegated_admins;
CREATE POLICY "Admins can view their delegated access"
ON public.delegated_admins FOR SELECT TO authenticated
USING (user_id = auth.uid());

COMMENT ON TABLE public.delegated_admins IS
'Server-enforced admin permissions. Mutations use the service role through protected API routes.';

CREATE OR REPLACE FUNCTION public.has_admin_permission(required_permission TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    LEFT JOIN public.delegated_admins da ON da.user_id = p.id
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
      AND (da.user_id IS NULL OR da.is_owner OR required_permission = ANY(da.permissions))
  );
$$;

REVOKE ALL ON FUNCTION public.has_admin_permission(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_admin_permission(TEXT) TO authenticated;

-- Protect admin-only data even when somebody calls Supabase directly instead of using the UI.
DROP POLICY IF EXISTS "Admins can manage email messages." ON public.email_messages;
CREATE POLICY "Permitted admins can manage email messages."
ON public.email_messages FOR ALL TO authenticated
USING (public.has_admin_permission('email.manage'))
WITH CHECK (public.has_admin_permission('email.manage'));

DROP POLICY IF EXISTS "Admins can manage talent requests." ON public.talent_requests;
CREATE POLICY "Permitted admins can manage talent requests."
ON public.talent_requests FOR ALL TO authenticated
USING (public.has_admin_permission('talent_requests.view'))
WITH CHECK (public.has_admin_permission('talent_requests.view'));

DROP POLICY IF EXISTS "Admins can view all disputes" ON public.disputes;
CREATE POLICY "Permitted admins can manage disputes"
ON public.disputes FOR ALL TO authenticated
USING (public.has_admin_permission('disputes.manage'))
WITH CHECK (public.has_admin_permission('disputes.manage'));

DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.admin_audit_logs;
CREATE POLICY "Permitted admins can view audit logs"
ON public.admin_audit_logs FOR SELECT TO authenticated
USING (
  public.has_admin_permission('overview.view')
  OR public.has_admin_permission('roles.manage')
);
