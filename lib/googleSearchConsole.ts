import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase_admin";

const PROVIDER = "google_search_console";
const clean = (value: unknown, max = 500) => String(value || "").trim().slice(0, max);

function credentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  if (!clientId || !clientSecret) throw new Error("Google OAuth is not configured.");
  return { clientId, clientSecret };
}

const key = () => crypto.createHash("sha256").update(process.env.SEO_TOKEN_ENCRYPTION_KEY || credentials().clientSecret).digest();
const encrypt = (value: string) => {
  const iv = crypto.randomBytes(12); const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv.toString("base64"), encrypted.toString("base64"), cipher.getAuthTag().toString("base64")].join(".");
};
const decrypt = (value: string) => {
  const [iv, encrypted, tag] = value.split("."); if (!iv || !encrypted || !tag) throw new Error("Invalid encrypted Google token.");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(encrypted, "base64")), decipher.final()]).toString("utf8");
};

export function searchConsoleAuthorizationUrl(state: string, redirectUri: string) {
  const { clientId } = credentials();
  return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: clientId, redirect_uri: redirectUri, response_type: "code", access_type: "offline", prompt: "consent", state,
    scope: "openid email profile https://www.googleapis.com/auth/webmasters.readonly",
  })}`;
}

export async function exchangeSearchConsoleCode(code: string, redirectUri: string, adminId: string) {
  const { clientId, clientSecret } = credentials();
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }), cache: "no-store" });
  const data = await response.json();
  if (!response.ok || !data.refresh_token) throw new Error(clean(data.error_description || data.error) || "Google did not return a refresh token.");
  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: `Bearer ${data.access_token}` }, cache: "no-store" });
  const profile = profileResponse.ok ? await profileResponse.json() : {};
  const { error } = await supabaseAdmin.from("seo_integrations").upsert({ provider: PROVIDER, encrypted_refresh_token: encrypt(String(data.refresh_token)), account_email: clean(profile.email, 320) || null, account_name: clean(profile.name, 200) || null, connected_by: adminId, connected_at: new Date().toISOString(), updated_at: new Date().toISOString(), metadata: {} });
  if (error) throw new Error(error.message);
}

async function accessToken() {
  const { data, error } = await supabaseAdmin.from("seo_integrations").select("encrypted_refresh_token").eq("provider", PROVIDER).maybeSingle();
  if (error) throw new Error(error.message); if (!data?.encrypted_refresh_token) throw new Error("Connect Google Search Console first.");
  const { clientId, clientSecret } = credentials();
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ refresh_token: decrypt(data.encrypted_refresh_token), client_id: clientId, client_secret: clientSecret, grant_type: "refresh_token" }), cache: "no-store" });
  const payload = await response.json(); if (!response.ok || !payload.access_token) throw new Error(clean(payload.error_description || payload.error) || "Unable to refresh Search Console access.");
  return String(payload.access_token);
}

async function googleRequest(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, headers: { ...(init?.headers || {}), Authorization: `Bearer ${await accessToken()}` }, cache: "no-store" });
  const data = await response.json(); if (!response.ok) throw new Error(clean(data.error?.message) || "Search Console request failed."); return data;
}

export async function searchConsoleStatus() {
  const { data } = await supabaseAdmin.from("seo_integrations").select("account_email,account_name,connected_at").eq("provider", PROVIDER).maybeSingle();
  return { connected: Boolean(data), configured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET), account: data || null };
}

export async function listSearchConsoleSites() {
  const data = await googleRequest("https://www.googleapis.com/webmasters/v3/sites");
  return Array.isArray(data.siteEntry) ? data.siteEntry : [];
}

export async function querySearchPerformance(siteUrl: string, days = 28) {
  const end = new Date(); end.setUTCDate(end.getUTCDate() - 3); const start = new Date(end); start.setUTCDate(start.getUTCDate() - Math.max(7, Math.min(days, 90)));
  const data = await googleRequest(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10), dimensions: ["query", "page"], rowLimit: 1000, dataState: "final" }) });
  return Array.isArray(data.rows) ? data.rows : [];
}

export async function disconnectSearchConsole() {
  const { error } = await supabaseAdmin.from("seo_integrations").delete().eq("provider", PROVIDER); if (error) throw new Error(error.message);
}
