# TaraWork

TaraWork is a Next.js marketplace app backed by Supabase.

## Engineering foundation

Architecture decisions, security priorities, testing strategy, database lifecycle, deployment gates, and the stabilization roadmap are documented in [`docs/engineering-foundation.md`](docs/engineering-foundation.md).

Registration-bot and SMTP-quota incidents are handled using [`docs/auth-abuse-response.md`](docs/auth-abuse-response.md).

## Workflow

### 1. Clone and install
```bash
npm install
```

### 2. Configure environment
Copy the committed environment contract, then replace its placeholders:

```bash
cp .env.example .env.local
```

Never expose `SUPABASE_SERVICE_ROLE_KEY`, database credentials, webhook secrets, or provider API keys through a `NEXT_PUBLIC_` variable.

### 3. Initialize database
1. Open Supabase SQL Editor.
2. Run `supabase_schema.sql`.
3. (Optional) Run `seed_test_data.sql` for sample data.
4. Verify realtime includes: `applications`, `jobs`, `messages`.

### 4. Start development
```bash
npm run dev
```
Open `http://localhost:3000`.

### 5. Make and validate changes
- Edit app code in `app/`, `components/`, `lib/`, `types/`.
- Verify database connectivity:

```bash
npm run db:check
```
- Run lint checks:

```bash
npm run typecheck
npm run lint
npm test
```

### 6. Build check before release
```bash
npm run build
npm run start
```

Run the complete local quality gate with:

```bash
npm run check
```

## Scripts

- `npm run dev` - Start local development server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Validate TypeScript without emitting files
- `npm test` - Run automated tests
- `npm run check` - Run type-check, lint, tests, and production build
- `npm run build` - Create production build
- `npm run start` - Run production server

## Notes

- Admin routes use `SUPABASE_SERVICE_ROLE_KEY` and must remain server-side only.
- Resume parsing endpoint (`app/api/parse-resume/route.ts`) degrades gracefully if `OPENAI_API_KEY` is missing.
