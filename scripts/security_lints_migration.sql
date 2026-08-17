BEGIN;

-- Pin SECURITY DEFINER name resolution to trusted schemas.
ALTER FUNCTION public.consume_user_credits(uuid, text, integer, jsonb, text) SET search_path = '';
ALTER FUNCTION public.grant_user_credits(uuid, integer, text, jsonb, text) SET search_path = '';
ALTER FUNCTION public.create_inquiry_notification() SET search_path = '';
ALTER FUNCTION public.create_follow_notification() SET search_path = '';
ALTER FUNCTION public.handle_new_user() SET search_path = '';

-- Credit balance mutations are server operations, never browser-callable RPCs.
REVOKE ALL ON FUNCTION public.consume_user_credits(uuid, text, integer, jsonb, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.grant_user_credits(uuid, integer, text, jsonb, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_user_credits(uuid, text, integer, jsonb, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.grant_user_credits(uuid, integer, text, jsonb, text) TO service_role;

-- Trigger functions execute through their triggers and must not be exposed as RPCs.
REVOKE ALL ON FUNCTION public.create_inquiry_notification() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_follow_notification() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prevent_profile_role_escalation() FROM PUBLIC, anon, authenticated;

-- This helper is only referenced by authenticated-role policies.
REVOKE ALL ON FUNCTION public.has_admin_permission(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_admin_permission(text) TO authenticated, service_role;

-- Keep the public portfolio contact form, but reject arbitrary/invalid inserts.
DROP POLICY IF EXISTS "Anyone can insert an inquiry." ON public.portfolio_inquiries;
DROP POLICY IF EXISTS "Validated visitors can insert inquiries." ON public.portfolio_inquiries;
CREATE POLICY "Validated visitors can insert inquiries."
ON public.portfolio_inquiries FOR INSERT TO anon, authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = freelancer_id AND p.role = 'freelancer')
  AND char_length(btrim(sender_name)) BETWEEN 1 AND 120
  AND char_length(btrim(sender_email)) BETWEEN 3 AND 320
  AND sender_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  AND char_length(btrim(message)) BETWEEN 10 AND 4000
  AND COALESCE(status, 'pending') = 'pending'
);

-- Legacy project tasks are no longer globally writable/readable.
DROP POLICY IF EXISTS "Users can view tasks for their projects." ON public.project_tasks;
DROP POLICY IF EXISTS "Users can manage tasks for their projects." ON public.project_tasks;
DROP POLICY IF EXISTS "Project members can view tasks." ON public.project_tasks;
DROP POLICY IF EXISTS "Project members can insert tasks." ON public.project_tasks;
DROP POLICY IF EXISTS "Project members can update tasks." ON public.project_tasks;
DROP POLICY IF EXISTS "Project members can delete tasks." ON public.project_tasks;
CREATE POLICY "Project members can view tasks."
ON public.project_tasks FOR SELECT TO authenticated
USING (
  assignee_id = auth.uid()
  OR public.is_staff()
  OR CASE WHEN project_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' THEN public.is_project_member(project_id::uuid) ELSE false END
);
CREATE POLICY "Project members can insert tasks."
ON public.project_tasks FOR INSERT TO authenticated
WITH CHECK (
  assignee_id = auth.uid()
  OR public.is_staff()
  OR CASE WHEN project_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' THEN public.is_project_member(project_id::uuid) ELSE false END
);
CREATE POLICY "Project members can update tasks."
ON public.project_tasks FOR UPDATE TO authenticated
USING (
  assignee_id = auth.uid()
  OR public.is_staff()
  OR CASE WHEN project_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' THEN public.is_project_member(project_id::uuid) ELSE false END
)
WITH CHECK (
  assignee_id = auth.uid()
  OR public.is_staff()
  OR CASE WHEN project_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' THEN public.is_project_member(project_id::uuid) ELSE false END
);
CREATE POLICY "Project members can delete tasks."
ON public.project_tasks FOR DELETE TO authenticated
USING (
  assignee_id = auth.uid()
  OR public.is_staff()
  OR CASE WHEN project_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' THEN public.is_project_member(project_id::uuid) ELSE false END
);

-- Public buckets serve object URLs without a broad storage.objects SELECT policy.
DROP POLICY IF EXISTS "Anyone can view attachments" ON storage.objects;

COMMIT;
