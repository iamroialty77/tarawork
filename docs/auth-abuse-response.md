# Authentication and SMTP Abuse Response

Use this runbook when automated registrations, password resets, or confirmation emails consume the authentication email quota.

## Immediate containment

1. In Supabase Dashboard, open Authentication logs and preserve the timestamps, IP-related metadata, affected email domains, and request volume.
2. Keep email confirmation enabled. Disabling confirmation allows attackers to create usable accounts for addresses they do not control.
3. Create a free Cloudflare Turnstile widget for the production domains.
4. Under Authentication > Bot and Abuse Protection:
   - enable CAPTCHA protection;
   - select Cloudflare Turnstile;
   - enter the Turnstile secret key.
5. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in local, preview, and production application environments.
6. Leave automated marketing/reminder jobs disabled until the suspicious accounts are reviewed.
7. Rotate SMTP credentials if they were shared, exposed, or used outside the approved application.
8. Contact the SMTP provider if reputation, suspension, or quota exhaustion occurred.

The application now fails closed for email registration when the public Turnstile key is absent. Supabase CAPTCHA enforcement is still required because a script can call the public Supabase Auth endpoint without loading the TaraWork UI.

## Supabase rate limits

Review Authentication > Rate Limits. Start conservatively and adjust using measured legitimate traffic:

- keep the per-user signup confirmation cooldown at least 60 seconds;
- keep the password-reset cooldown at least 60 seconds;
- set the project-wide email-send limit below the safe SMTP-provider quota;
- alert before the provider quota is exhausted.

Rate limits limit damage, but CAPTCHA is the primary control for distributed registration bots.

## SMTP separation

Authentication and marketing email must not share reputation or quota:

- authentication sender: `no-reply@auth.example.com`;
- marketing sender: `updates@marketing.example.com`;
- separate provider credentials, streams, or subaccounts;
- configure SPF, DKIM, and DMARC for both domains;
- maintain a provider-level daily cap and alerts.

TaraWork reminder and job-match automation now excludes users whose Auth email is not confirmed.

## Suspicious-account review

Before deleting accounts, export evidence and confirm the selection criteria. Useful indicators include:

- unconfirmed accounts created during the incident window;
- no successful sign-in;
- no legitimate profile activity;
- repeated naming patterns or disposable domains;
- high-volume creation within a short interval.

Delete or quarantine only after reviewing false-positive risk. Do not automatically delete based solely on email domain.

## Recovery checklist

- CAPTCHA is enforced by Supabase and visible in the signup form.
- Email confirmation remains enabled.
- SMTP credentials are private and rotated when necessary.
- Auth and marketing email are separated.
- Suspicious accounts are reviewed.
- Provider quota and sending reputation are healthy.
- A legitimate signup, confirmation, login, and password reset succeed.
- Automation is re-enabled with a controlled batch size.
