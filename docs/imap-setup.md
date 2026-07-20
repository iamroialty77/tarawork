# Hostinger IMAP setup

Add these server-only variables to `.env.local` for local development and to the deployment environment for production:

```env
IMAP_HOST=imap.hostinger.com
IMAP_PORT=993
IMAP_SECURE=true
IMAP_USER=hello@tarawork.online
IMAP_PASS=your-mailbox-password
```

`IMAP_USER` must be the complete mailbox address. Never prefix these variables with `NEXT_PUBLIC_` and never commit the password.

After restarting the app, open **Admin → Email** and select **Sync mailbox**. The sync imports the latest 50 messages from each detected Inbox, Sent, Drafts, and Trash folder. Subsequent syncs use the IMAP folder and UID saved in message metadata to avoid duplicate imports.

Read/unread, move to Trash, restore, and permanent delete actions are applied to Hostinger for IMAP-synced messages. Locally logged SMTP messages continue to work through the existing TaraWork message log.

The storage card displays the provider quota when the IMAP server exposes the QUOTA capability. Otherwise, it clearly falls back to the TaraWork storage estimate and `ADMIN_EMAIL_STORAGE_LIMIT_BYTES` configuration.
