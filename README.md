# TaraWork

TaraWork is a Next.js marketplace app backed by Supabase.

## Workflow

### 1. Clone and install
```bash
npm install
```

### 2. Configure environment
Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_postgres_connection_string
OPENAI_API_KEY=your_openai_api_key
```

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
- Run lint checks:

```bash
npm run lint
```

### 6. Build check before release
```bash
npm run build
npm run start
```

## Scripts

- `npm run dev` - Start local development server
- `npm run lint` - Run ESLint
- `npm run build` - Create production build
- `npm run start` - Run production server

## Notes

- Admin routes use `SUPABASE_SERVICE_ROLE_KEY` and must remain server-side only.
- Resume parsing endpoint (`app/api/parse-resume/route.ts`) degrades gracefully if `OPENAI_API_KEY` is missing.
