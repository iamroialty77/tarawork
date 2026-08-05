-- Supabase Performance Advisor remediation (2026-08-05).
-- Idempotently caches auth function results per statement, consolidates overlapping
-- permissive policies without reducing their effective access, and removes one
-- duplicate index.

begin;

-- PostgreSQL can evaluate a scalar initplan once per statement. Wrapping auth
-- helpers in SELECT prevents them from being evaluated once for every row.
do $migration$
declare
  policy_row record;
  optimized_using text;
  optimized_check text;
  alter_sql text;
begin
  for policy_row in
    select
      n.nspname as schema_name,
      c.relname as table_name,
      p.polname as policy_name,
      pg_get_expr(p.polqual, p.polrelid) as using_expression,
      pg_get_expr(p.polwithcheck, p.polrelid) as check_expression
    from pg_policy p
    join pg_class c on c.oid = p.polrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and concat(
        coalesce(pg_get_expr(p.polqual, p.polrelid), ''),
        ' ',
        coalesce(pg_get_expr(p.polwithcheck, p.polrelid), '')
      ) ~ 'auth\.(uid|role|jwt)\(\)'
  loop
    optimized_using := policy_row.using_expression;
    optimized_check := policy_row.check_expression;

    if optimized_using is not null then
      optimized_using := replace(optimized_using, 'auth.uid()', '(select auth.uid())');
      optimized_using := replace(optimized_using, 'auth.role()', '(select auth.role())');
      optimized_using := replace(optimized_using, 'auth.jwt()', '(select auth.jwt())');
    end if;
    if optimized_check is not null then
      optimized_check := replace(optimized_check, 'auth.uid()', '(select auth.uid())');
      optimized_check := replace(optimized_check, 'auth.role()', '(select auth.role())');
      optimized_check := replace(optimized_check, 'auth.jwt()', '(select auth.jwt())');
    end if;

    alter_sql := format(
      'alter policy %I on %I.%I',
      policy_row.policy_name,
      policy_row.schema_name,
      policy_row.table_name
    );
    if optimized_using is not null then
      alter_sql := alter_sql || format(' using (%s)', optimized_using);
    end if;
    if optimized_check is not null then
      alter_sql := alter_sql || format(' with check (%s)', optimized_check);
    end if;
    execute alter_sql;
  end loop;
end
$migration$;

-- Consolidate policies whose effective permission is the OR of their old rules.
drop policy if exists "Hirers can view applications for their jobs" on public.applications;
drop policy if exists "Users can view their own applications" on public.applications;
drop policy if exists "employers can view applications for their jobs" on public.applications;
drop policy if exists "Application participants can view applications" on public.applications;
create policy "Application participants can view applications"
  on public.applications for select to public
  using (
    (select auth.uid()) = freelancer_id
    or exists (
      select 1 from public.jobs
      where jobs.id = applications.job_id
        and (
          jobs.hirer_id = (select auth.uid())
          or jobs.employer_id = (select auth.uid())
        )
    )
  );

drop policy if exists "Admins can view all product feedback." on public.product_feedback;
drop policy if exists "Users can view their own product feedback." on public.product_feedback;
drop policy if exists "Users and admins can view product feedback" on public.product_feedback;
create policy "Users and admins can view product feedback"
  on public.product_feedback for select to public
  using (
    (select auth.uid()) = user_id
    or exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'admin'
    )
  );

drop policy if exists "Employers can view sent talent invitations." on public.talent_invitations;
drop policy if exists "Freelancers can view received talent invitations." on public.talent_invitations;
drop policy if exists "Invitation participants can view invitations" on public.talent_invitations;
create policy "Invitation participants can view invitations"
  on public.talent_invitations for select to public
  using (
    (select auth.uid()) = employer_id
    or (select auth.uid()) = freelancer_id
  );

-- The permission-aware policies supersede these legacy admin-role policies.
-- Preserve both old and new access predicates in one policy before dropping them.
alter policy "Permitted admins can view audit logs" on public.admin_audit_logs
  using (
    private.has_admin_permission('overview.view')
    or private.has_admin_permission('roles.manage')
    or exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'admin'
    )
  );
drop policy if exists "Admins can view all audit logs" on public.admin_audit_logs;

alter policy "Permitted admins can manage disputes" on public.disputes
  using (
    private.has_admin_permission('disputes.manage')
    or exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'admin'
    )
  )
  with check (
    private.has_admin_permission('disputes.manage')
    or exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'admin'
    )
  );
drop policy if exists "Admins can view all disputes" on public.disputes;

alter policy "Permitted admins can manage email messages." on public.email_messages
  using (
    private.has_admin_permission('email.manage')
    or exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'admin'
    )
  )
  with check (
    private.has_admin_permission('email.manage')
    or exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'admin'
    )
  );
drop policy if exists "Admins can manage email messages." on public.email_messages;

alter policy "Permitted admins can manage talent requests." on public.talent_requests
  using (
    private.has_admin_permission('talent_requests.view')
    or exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'admin'
    )
  )
  with check (
    private.has_admin_permission('talent_requests.view')
    or exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'admin'
    )
  );
drop policy if exists "Admins can manage talent requests." on public.talent_requests;

-- Split ALL policies into write commands when a separate SELECT policy already
-- grants the same (or broader) read access. This removes redundant SELECT checks.
do $migration$
declare
  item record;
begin
  for item in
    select * from (values
      ('blog_posts', 'Admins can manage blog posts.',
       '(exists (select 1 from public.profiles where profiles.id = (select auth.uid()) and profiles.role = ''admin''))'),
      ('client_members', 'staff manage memberships', 'private.is_staff()'),
      ('clients', 'staff manage clients', 'private.is_staff()'),
      ('invoices', 'staff manage invoices', 'private.is_staff()'),
      ('job_categories', 'Only admins can manage job categories.',
       '(exists (select 1 from public.profiles where profiles.id = (select auth.uid()) and profiles.role = ''admin''))'),
      ('page_section_versions', 'staff manage section versions', 'private.is_staff()'),
      ('page_sections', 'staff manage sections', 'private.is_staff()'),
      ('portfolio_items', 'Users can manage their own portfolio items', '((select auth.uid()) = profile_id)'),
      ('portfolio_links', 'Users can manage their own links.',
       '(exists (select 1 from public.portfolios where portfolios.id = portfolio_links.portfolio_id and portfolios.profile_id = (select auth.uid())))'),
      ('portfolio_projects', 'Users can manage their own projects.',
       '(exists (select 1 from public.portfolios where portfolios.id = portfolio_projects.portfolio_id and portfolios.profile_id = (select auth.uid())))'),
      ('portfolio_skills', 'Users can manage their own skills.',
       '(exists (select 1 from public.portfolios where portfolios.id = portfolio_skills.portfolio_id and portfolios.profile_id = (select auth.uid())))'),
      ('portfolios', 'Users can manage their own portfolio.', '((select auth.uid()) = profile_id)'),
      ('post_versions', 'staff manage post versions', 'private.is_staff()'),
      ('posts', 'staff manage posts', 'private.is_staff()'),
      ('projects', 'staff manage projects', 'private.is_staff()')
    ) as policies(table_name, old_policy_name, predicate)
  loop
    execute format('drop policy if exists %I on public.%I', item.old_policy_name, item.table_name);
    execute format('drop policy if exists %I on public.%I', item.old_policy_name || ' insert', item.table_name);
    execute format('drop policy if exists %I on public.%I', item.old_policy_name || ' update', item.table_name);
    execute format('drop policy if exists %I on public.%I', item.old_policy_name || ' delete', item.table_name);
    execute format(
      'create policy %I on public.%I for insert to public with check (%s)',
      item.old_policy_name || ' insert', item.table_name, item.predicate
    );
    execute format(
      'create policy %I on public.%I for update to public using (%s) with check (%s)',
      item.old_policy_name || ' update', item.table_name, item.predicate, item.predicate
    );
    execute format(
      'create policy %I on public.%I for delete to public using (%s)',
      item.old_policy_name || ' delete', item.table_name, item.predicate
    );
  end loop;
end
$migration$;

-- blog_posts public SELECT did not previously include unpublished admin rows via
-- its public-read rule, so retain that part of the former ALL policy explicitly.
alter policy "Published blog posts are public." on public.blog_posts
  using (
    (status = 'published' and published_at <= timezone('utc', now()))
    or exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'admin'
    )
  );

drop index if exists public.idx_email_messages_type_created;

commit;
