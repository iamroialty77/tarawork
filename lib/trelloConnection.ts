import { decryptSecret, encryptSecret } from "@/lib/crypto";
import { supabaseAdmin } from "@/lib/supabase_admin";
import type { TrelloCredentials } from "@/lib/trello";

type StoredConnection = {
  user_id: string;
  trello_member_id: string;
  trello_username: string | null;
  trello_full_name: string | null;
  access_token_encrypted: string;
  token_scope: string | null;
  token_expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export class TrelloConnectionRequiredError extends Error {
  constructor(message = "Trello account is not connected for this user.") {
    super(message);
    this.name = "TrelloConnectionRequiredError";
  }
}

function getTrelloApiKey() {
  const key = process.env.TRELLO_API_KEY;

  if (!key) {
    throw new Error("TRELLO_API_KEY is not configured.");
  }

  return key;
}

export async function getStoredTrelloConnection(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_trello_connections")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Unable to fetch Trello connection: ${error.message}`);
  }

  return (data as StoredConnection | null) ?? null;
}

export async function getTrelloCredentialsForUser(userId: string): Promise<TrelloCredentials | null> {
  const connection = await getStoredTrelloConnection(userId);

  if (!connection) {
    return null;
  }

  return {
    key: getTrelloApiKey(),
    token: decryptSecret(connection.access_token_encrypted),
  };
}

export async function getTrelloCredentialsForUserOrThrow(userId: string): Promise<TrelloCredentials> {
  const userCredentials = await getTrelloCredentialsForUser(userId);
  if (!userCredentials) {
    throw new TrelloConnectionRequiredError();
  }
  return userCredentials;
}

export async function saveTrelloConnection({
  userId,
  memberId,
  username,
  fullName,
  token,
  scope,
  expiresAt,
}: {
  userId: string;
  memberId: string;
  username?: string;
  fullName?: string;
  token: string;
  scope?: string;
  expiresAt?: string | null;
}) {
  const encryptedToken = encryptSecret(token);

  const { error } = await supabaseAdmin.from("user_trello_connections").upsert(
    [
      {
        user_id: userId,
        trello_member_id: memberId,
        trello_username: username || null,
        trello_full_name: fullName || null,
        access_token_encrypted: encryptedToken,
        token_scope: scope || null,
        token_expires_at: expiresAt || null,
        updated_at: new Date().toISOString(),
      },
    ],
    { onConflict: "user_id" },
  );

  if (error) {
    throw new Error(`Unable to save Trello connection: ${error.message}`);
  }
}

export async function deleteTrelloConnection(userId: string) {
  const { error } = await supabaseAdmin.from("user_trello_connections").delete().eq("user_id", userId);

  if (error) {
    throw new Error(`Unable to remove Trello connection: ${error.message}`);
  }
}
