import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase_admin";

const CONNECTION_TYPE = "google_sheets_connection";
const clean = (value: unknown, max: number) => String(value || "").trim().slice(0, max);

function credentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  if (!clientId || !clientSecret) throw new Error("Google Sheets OAuth is not fully configured.");
  return { clientId, clientSecret };
}

function encryptionKey() {
  return crypto.createHash("sha256").update(credentials().clientSecret).digest();
}

function encrypt(value: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv.toString("base64"), encrypted.toString("base64"), cipher.getAuthTag().toString("base64")].join(".");
}

function decrypt(value: string) {
  const [iv, encrypted, tag] = value.split(".");
  if (!iv || !encrypted || !tag) throw new Error("Invalid Google token.");
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(encrypted, "base64")), decipher.final()]).toString("utf8");
}

export function googleAuthorizationUrl(state: string, redirectUri: string) {
  const { clientId } = credentials();
  const query = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    state,
    scope: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/drive.metadata.readonly",
    ].join(" "),
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${query}`;
}

export async function exchangeGoogleCode(code: string, redirectUri: string) {
  const { clientId, clientSecret } = credentials();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok || !data.refresh_token) throw new Error(clean(data.error_description || data.error, 300) || "Google did not return a refresh token.");
  return String(data.refresh_token);
}

export async function saveGoogleConnection(refreshToken: string, adminId: string) {
  const { error } = await supabaseAdmin.from("email_messages").insert({
    type: CONNECTION_TYPE, direction: "outbound", subject: "Google Sheets connection",
    text_body: "", status: "draft", metadata: { refreshToken: encrypt(refreshToken), connectedBy: adminId, connectedAt: new Date().toISOString() },
  });
  if (error) throw new Error(error.message);
}

async function getRefreshToken(adminId: string) {
  const { data, error } = await supabaseAdmin.from("email_messages").select("metadata")
    .eq("type", CONNECTION_TYPE)
    .contains("metadata", { connectedBy: adminId })
    .order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  const token = clean(data?.metadata?.refreshToken, 10000);
  return token ? decrypt(token) : null;
}

export async function googleConnectionStatus(adminId: string) {
  const connected = Boolean(await getRefreshToken(adminId));
  if (!connected) return { connected: false, configured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET), account: null };
  const data = await googleGet("https://www.googleapis.com/drive/v3/about?fields=user(displayName,emailAddress,photoLink)", adminId);
  return {
    connected: true,
    configured: true,
    account: {
      name: clean(data.user?.displayName, 200),
      email: clean(data.user?.emailAddress, 320),
      photoUrl: clean(data.user?.photoLink, 500),
    },
  };
}

async function accessToken(adminId: string) {
  const refreshToken = await getRefreshToken(adminId);
  if (!refreshToken) throw new Error("Connect Google Sheets first.");
  const { clientId, clientSecret } = credentials();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ refresh_token: refreshToken, client_id: clientId, client_secret: clientSecret, grant_type: "refresh_token" }),
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error(clean(data.error_description || data.error, 300) || "Unable to refresh Google access.");
  return String(data.access_token);
}

async function googleGet(url: string, adminId: string) {
  const response = await fetch(url, { headers: { Authorization: `Bearer ${await accessToken(adminId)}` }, cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(clean(data.error?.message, 300) || "Google Sheets request failed.");
  return data;
}

export async function listGoogleSpreadsheets(adminId: string) {
  const query = new URLSearchParams({
    q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
    fields: "files(id,name,modifiedTime,webViewLink)",
    orderBy: "modifiedTime desc",
    pageSize: "100",
  });
  const data = await googleGet(`https://www.googleapis.com/drive/v3/files?${query}`, adminId);
  return Array.isArray(data.files) ? data.files : [];
}

export async function listGoogleSheetTabs(spreadsheetId: string, adminId: string) {
  const data = await googleGet(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=properties.title,sheets.properties`, adminId);
  const sheets = (data.sheets || []).map((sheet: { properties?: { title?: string; sheetId?: number } }) => ({
    title: clean(sheet.properties?.title, 200), sheetId: sheet.properties?.sheetId,
  })).filter((sheet: { title: string }) => sheet.title);
  return { spreadsheetName: clean(data.properties?.title, 200) || "Google Sheet", sheets };
}

export async function readGoogleSheet(spreadsheetId: string, sheetName: string, adminId: string) {
  const range = `'${sheetName.replace(/'/g, "''")}'`;
  const data = await googleGet(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?majorDimension=ROWS`, adminId);
  const values: unknown[][] = Array.isArray(data.values) ? data.values : [];
  const rawHeaders = (values[0] || []).map((value) => clean(value, 100));
  if (!rawHeaders.length || rawHeaders.some((header) => !header)) throw new Error("The first Google Sheet row must contain complete column headers.");
  const headers = rawHeaders.map((header, index) => {
    const normalized = header.replace(/[^\p{L}\p{N}_-]+/gu, "_").replace(/^_+|_+$/g, "").toLowerCase() || `column_${index + 1}`;
    return rawHeaders.slice(0, index).some((item) => item.toLowerCase() === header.toLowerCase()) ? `${normalized}_${index + 1}` : normalized;
  });
  const rows = values.slice(1, 501).filter((row) => row.some((value) => clean(value, 2000))).map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, clean(row[index], 2000)])));
  return { headers, rows, wasLimited: values.length > 501 };
}

export async function disconnectGoogleConnection(adminId: string) {
  const refreshToken = await getRefreshToken(adminId);
  if (refreshToken) {
    await fetch("https://oauth2.googleapis.com/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token: refreshToken }),
      cache: "no-store",
    }).catch(() => null);
  }
  const { error } = await supabaseAdmin.from("email_messages").delete()
    .eq("type", CONNECTION_TYPE)
    .contains("metadata", { connectedBy: adminId });
  if (error) throw new Error(error.message);
}
