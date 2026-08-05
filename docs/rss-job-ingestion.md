# RSS job ingestion

TaraWork imports configured RSS feeds through `GET /api/cron/rss-jobs` every six hours. The route requires Vercel's `Authorization: Bearer $CRON_SECRET` header.

## One-time database setup

Run `scripts/rss_jobs_migration.sql` in the Supabase SQL editor. It adds provenance, source URL, publish/expiry timestamps, and indexes without changing existing client jobs.

## Environment variables

Configure these in Vercel for Production (and Preview only if desired):

```env
RSS_JOB_FEEDS=[{"name":"Trusted Job Board","url":"https://jobs.example.com/feed.xml"}]
RSS_JOB_EXPIRY_DAYS=21
```

Only trusted HTTPS feed URLs are accepted. Expiry is clamped to 14-30 days. Do not add a feed unless its publisher permits aggregation and displaying its job content.

## Behavior

- At most 50 recent items are read from each feed per run.
- Duplicate source URLs and normalized title/company pairs are skipped.
- RSS rows use deterministic IDs and `source = 'rss'`.
- Expired RSS rows are changed from `live` to `closed`; client jobs are never expired by this process.
- External listings open their original source instead of creating an internal TaraWork application.
- A failure in one feed is reported without preventing the remaining feeds from being processed.

For a manual production test, send an authenticated GET request to `/api/cron/rss-jobs` and inspect the JSON counts for `inserted`, `duplicates`, `expired`, and `errors`.
