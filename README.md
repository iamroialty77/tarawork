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
NEXT_PUBLIC_APP_URL=http://localhost:3000
PAYMONGO_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYMONGO_WEBHOOK_SECRET=whsk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYMONGO_PAYMENT_METHODS=gcash,card,grab_pay
```

### 3. Initialize database
1. Open Supabase SQL Editor.
2. Run `supabase_schema.sql`.
3. (Optional) Run `seed_test_data.sql` for sample data.
4. Verify realtime includes: `applications`, `jobs`, `messages`.
5. If your DB is already existing, run `docs/paymongo_webhook_upgrade.sql` (includes `credit_topup` product support).
6. Run `docs/premium_credits_upgrade.sql` to enable premium credit wallet + ledger RPCs.
7. Configure PayMongo webhook URL to `https://your-domain.com/api/paymongo/webhook`.
8. Enable webhook events:
   - `checkout_session.payment.paid`
   - `checkout_session.payment.failed`
   - `subscription.invoice.paid`
   - `subscription.invoice.payment_failed`
   - `subscription.unpaid`
   - `subscription.past_due`
   - `subscription.cancelled`

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
- PayMongo webhook processing is idempotent and logs events in `paymongo_events`.
