# TaraWork Engineering Foundation

Status: baseline architecture decision and stabilization plan  
Last reviewed: 2026-07-25

## 1. Product boundary

TaraWork is a two-sided marketplace:

- Freelancers create profiles, portfolios, applications, and conversations.
- Employers publish jobs, shortlist talent, send invitations, and hire.
- Administrators moderate users, jobs, content, and email operations.
- Scheduled jobs send profile reminders and job matches.
- External integrations currently include Supabase, OpenAI, SMTP/IMAP, Trello, and Vercel.

Until the foundation milestones below are complete, new feature work should be limited to production defects, compliance work, and changes required to complete an already active workflow.

## 2. Architecture decision

Use a modular monolith. A microservice architecture would add deployment, networking, observability, and data-consistency costs before the product needs them.

```text
Browser
  |
  | HTTPS
  v
Next.js routes and server components
  |
  +-- application services (use cases and authorization)
  |      |
  |      +-- domain rules and validation
  |      |
  |      +-- repositories
  |             |
  |             v
  |         Supabase/Postgres
  |
  +-- external adapters (OpenAI, email, Trello)
```

The dependency direction is inward:

1. UI depends on application services.
2. Application services depend on domain types and repository interfaces.
3. Database and external integrations implement those interfaces.
4. Domain code does not import React, Next.js, Supabase, or environment variables.

## 3. Source-of-truth decisions

### Database

Supabase Postgres is the source of truth. Supabase Auth is the identity provider.

- Use `@supabase/ssr` for authenticated browser/server requests governed by RLS.
- Use the service-role client only inside server-only repositories after explicit authorization.
- Do not perform database queries directly in large UI components.
- Choose one migration system. The recommended path is versioned Supabase SQL migrations because the application already relies on Supabase Auth, RLS, Storage, and Realtime.
- Remove the empty Prisma schema after confirming no production code uses Prisma.
- Add `postgres` as a direct dependency if direct SQL remains; transitive dependencies must not be imported.

### Public profile

The canonical public route is `/{username}`. `/p/{username}` remains a redirect only.

The public-profile feature should be split into:

```text
app/[username]/page.tsx             route composition and metadata only
features/profiles/domain.ts         public profile types and invariants
features/profiles/normalizers.ts    legacy-to-canonical data conversion
features/profiles/repository.ts     database queries
features/profiles/service.ts        getPublicProfile use case
features/profiles/components/       freelancer and employer presentation
```

The route must not:

- perform fuzzy user matching;
- inspect database schema errors to choose a table;
- fetch private Auth email addresses for public display;
- contain demo records;
- mix employer and freelancer database rules with presentation markup.

Any legacy migration must be completed in the database, verified, and removed from runtime code.

## 4. Trust boundaries and authorization

Every request that changes or exposes non-public data must follow:

```text
authenticate -> validate input -> authorize resource/action
-> execute transaction -> audit important action -> return safe response
```

Required rules:

- A user ID supplied by the client is never proof of identity.
- Ownership is checked server-side using the authenticated user ID.
- Employer, freelancer, and admin roles are checked centrally.
- Service-role access never substitutes for authorization.
- Database RLS remains enabled as defense in depth.
- Error responses do not expose raw database messages in production.
- Public profile data has an explicit allowlist. Auth email and private phone data are excluded unless the owner deliberately publishes them.

### Immediate security blockers

1. `app/api/webhooks/github/route.ts` must verify the GitHub HMAC signature and allowlisted event before invoking any financial operation. Keep the financial operation disabled until this is implemented and tested.
2. `GET /api/talent-invitations` must authenticate the caller and derive the user ID from the session instead of trusting `?userId=`.
3. Placeholder mutation endpoints such as `POST /api/projects` must return `501 Not Implemented` or be removed; they must not report successful writes.
4. Replace the in-memory rate limiter with a shared store suitable for serverless deployment.
5. Add request size limits, schema validation, and idempotency protection to webhooks and financially sensitive actions.
6. Review the `portfolio_inquiries` anonymous insert policy and protect it with abuse controls.

## 5. Database lifecycle

Create a migration for every schema change:

```text
supabase/
  migrations/
    YYYYMMDDHHMM_description.sql
  seed.sql
```

Each migration must contain:

- forward schema changes;
- indexes and constraints;
- RLS changes and policies;
- data backfill when required;
- verification queries in the pull-request description;
- a rollback or recovery procedure for destructive changes.

Required database improvements:

- Define canonical tables for portfolios and delete the legacy dual-write/read path.
- Add foreign-key indexes used by jobs, applications, invitations, messages, and portfolio queries.
- Add unique constraints for business invariants such as one saved talent per employer/freelancer pair.
- Use transactions for multi-step hiring and notification operations.
- Separate public profile fields from private contact/application data.
- Generate TypeScript database types from the deployed schema.

Never detect schema shape through `information_schema` during a normal user request. Deployment must guarantee the expected schema before the new application version receives traffic.

## 6. Testing strategy

The project currently has no automated test suite. Add tests in this order:

### Unit tests

Use Vitest for pure logic:

- profile normalizers and public-field allowlist;
- role and ownership rules;
- currency/rate formatting;
- webhook signature verification;
- job matching rules.

### Integration tests

Run against an isolated local Supabase database:

- RLS policies for freelancer, employer, admin, and anonymous users;
- profile repository queries;
- job close and application approval transactions;
- saved talent and invitation authorization;
- migration from legacy portfolio data.

### End-to-end tests

Use Playwright for critical paths:

1. Sign up and complete a freelancer profile.
2. Publish and view a public profile on mobile and desktop.
3. Employer creates and closes a job.
4. Freelancer applies; employer approves.
5. Employer saves/invites talent; contact unlock follows the business rule.
6. Unauthorized users cannot access admin or another user's records.

### Quality gates

Every pull request must pass:

```text
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

Critical paths require tests before refactoring. Target meaningful risk coverage, not a percentage alone.

## 7. Git and delivery

Use short-lived branches and pull requests:

```text
main
  <- fix/...
  <- feature/...
  <- refactor/...
```

Commit messages should explain intent, for example:

```text
fix(webhooks): verify GitHub signature before processing
refactor(profiles): move public query into repository
test(authz): cover invitation ownership rules
```

Repository requirements:

- Add `.env.example` containing names and safe descriptions only.
- Stop tracking IDE metadata and development logs.
- Add pull-request and issue templates.
- Protect `main`: required review, required CI, no force push.
- Use Dependabot or Renovate for controlled dependency updates.
- Tag production releases and maintain a changelog.

## 8. Deployment and operations

Recommended environments:

| Environment | Purpose | Database |
| --- | --- | --- |
| Local | Development and tests | Local Supabase |
| Preview | Pull-request verification | Isolated staging project |
| Production | Real users | Production project |

Deployment sequence:

1. CI validates types, lint, tests, and build.
2. Backward-compatible database migrations run.
3. Application deploys to preview.
4. Smoke tests run against preview.
5. Production deployment uses the verified artifact.
6. Post-deploy health and critical-path checks run.

Operational minimum:

- structured logs with request/correlation IDs;
- error monitoring and alerting;
- uptime checks for public pages and critical APIs;
- database backups with a tested restore procedure;
- secret rotation procedure;
- cron execution logs and failure alerts;
- audit logs for admin and financial actions;
- documented rollback and incident-response runbooks.

## 9. Maintainability rules

- Prefer feature modules over a flat global `components/` directory.
- A route handles HTTP; a service handles a use case; a repository handles persistence.
- Validate external input with Zod at the boundary.
- Avoid `any` in domain and repository interfaces.
- Do not leave demo or placeholder success behavior in production routes.
- Keep components focused. Large screens should be composed from testable sections and hooks.
- Record significant choices in `docs/decisions/NNNN-title.md`.
- Delete compatibility code after its migration window.

## 10. Stabilization roadmap

### Implementation status (2026-07-25)

- GitHub webhook HMAC verification, event filtering, payload limits, and a default-off financial kill switch are implemented.
- Talent invitation reads now derive identity from the authenticated session.
- The placeholder project mutation now returns `501 Not Implemented`.
- The environment contract, CI quality workflow, direct `postgres` dependency, and initial security tests are implemented.
- Dependency remediation, shared rate limiting, database migrations, and profile modularization remain open.

### Phase 0: contain immediate risk

- Disable or secure the GitHub financial webhook.
- Fix invitation data authorization.
- Make placeholder mutations fail honestly.
- Add `.env.example` and document all required secrets.
- Repair clean installation so lint, typecheck, and build run locally.

Exit condition: no known unauthenticated sensitive mutation/read path and a clean reproducible build.

### Phase 1: establish repeatable delivery

- Add CI and the five quality-gate scripts.
- Add Vitest and the first authorization/normalizer tests.
- Add Playwright smoke tests.
- Introduce versioned database migrations.
- Add generated Supabase database types.

Exit condition: every change is automatically validated and database changes are reproducible.

### Phase 2: refactor public profiles

- Extract the public-profile repository, normalizers, and service.
- Remove fuzzy profile lookup, Auth-email fallback, demo data, and runtime schema fallbacks.
- Split employer and freelancer presentation components.
- Add caching/revalidation rules after correctness is established.

Exit condition: `app/[username]/page.tsx` only composes the route and metadata, and profile behavior is covered by tests.

### Phase 3: modularize core workflows

- Split `TaraWorkApp`, `Workspace`, and `AdminDashboard` by feature.
- Centralize role/ownership authorization.
- Move multi-write workflows into transactional services.
- Standardize API response and error formats.

Exit condition: each core workflow has an owner module, explicit API, and integration coverage.

### Phase 4: operational maturity

- Add monitoring, audit coverage, backup restore drills, and incident runbooks.
- Add performance budgets and accessibility checks.
- Establish dependency and security review cadence.

Exit condition: releases, failures, recovery, and maintenance are documented and observable.

## 11. Definition of done

A change is complete only when:

- acceptance criteria are satisfied;
- authorization and privacy impact were reviewed;
- input and output are typed and validated;
- tests cover the important success and failure paths;
- lint, typecheck, tests, and production build pass;
- schema changes use migrations;
- logs contain no secrets or unnecessary personal data;
- documentation and operational notes are updated;
- rollback or recovery is understood.
