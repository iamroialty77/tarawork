import { ImapFlow } from "imapflow";

export const isImapConfigured = () => Boolean((process.env.IMAP_USER || process.env.SMTP_USER) && (process.env.IMAP_PASS || process.env.SMTP_PASS));

export const createImapClient = () => {
  const user = process.env.IMAP_USER || process.env.SMTP_USER || "";
  const pass = process.env.IMAP_PASS || process.env.SMTP_PASS || "";
  if (!user || !pass) throw new Error("IMAP is not configured. Add IMAP_USER and IMAP_PASS to the server environment.");
  return new ImapFlow({
    host: process.env.IMAP_HOST || "imap.hostinger.com",
    port: Number(process.env.IMAP_PORT || 993),
    secure: process.env.IMAP_SECURE !== "false",
    auth: { user, pass },
    logger: false,
  });
};

export async function withImapClient<T>(work: (client: ImapFlow) => Promise<T>) {
  const client = createImapClient();
  await client.connect();
  try { return await work(client); }
  finally { await client.logout().catch(() => undefined); }
}

export async function getImapFolders(client: ImapFlow) {
  const mailboxes = await client.list();
  const find = (specialUse: string, fallback: string) => mailboxes.find((box) => box.specialUse === specialUse)?.path || mailboxes.find((box) => box.path.toLowerCase() === fallback.toLowerCase())?.path;
  return {
    inbox: find("\\Inbox", "INBOX") || "INBOX",
    sent: find("\\Sent", "Sent"),
    drafts: find("\\Drafts", "Drafts"),
    trash: find("\\Trash", "Trash"),
  };
}

export async function applyImapMessageAction(metadata: Record<string, any>, action: "read" | "unread" | "trash" | "restore" | "delete") {
  if (!metadata.imapUid || !metadata.imapFolder || !isImapConfigured()) return metadata;
  return withImapClient(async (client) => {
    const folders = await getImapFolders(client);
    const lock = await client.getMailboxLock(metadata.imapFolder);
    try {
      const uid = Number(metadata.imapUid);
      if (action === "read") await client.messageFlagsAdd(uid, ["\\Seen"], { uid: true });
      if (action === "unread") await client.messageFlagsRemove(uid, ["\\Seen"], { uid: true });
      if (action === "delete") await client.messageDelete(uid, { uid: true });
      if (action === "trash" && folders.trash) {
        const moved: any = await client.messageMove(uid, folders.trash, { uid: true });
        metadata.previousImapFolder = metadata.imapFolder;
        metadata.imapFolder = folders.trash;
        metadata.imapUid = moved?.uidMap?.get?.(uid) || moved?.get?.(uid) || metadata.imapUid;
      }
      if (action === "restore") {
        const destination = metadata.previousImapFolder || folders.inbox;
        const moved: any = await client.messageMove(uid, destination, { uid: true });
        metadata.imapFolder = destination;
        metadata.imapUid = moved?.uidMap?.get?.(uid) || moved?.get?.(uid) || metadata.imapUid;
      }
      return metadata;
    } finally { lock.release(); }
  });
}

export async function getImapQuota() {
  if (!isImapConfigured()) return null;
  return withImapClient(async (client) => {
    const getQuota = (client as any).getQuota;
    if (typeof getQuota !== "function") return null;
    const result = await getQuota.call(client, "").catch(() => null);
    const storage = result?.storage || result?.quota?.storage || result?.resources?.storage;
    if (!storage) return null;
    const used = Number(storage.usage ?? storage.used ?? storage[0]);
    const limit = Number(storage.limit ?? storage.total ?? storage[1]);
    if (!Number.isFinite(used) || !Number.isFinite(limit) || limit <= 0) return null;
    return { usedBytes: used * 1024, limitBytes: limit * 1024 };
  });
}
