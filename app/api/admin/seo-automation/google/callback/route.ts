import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { exchangeSearchConsoleCode } from "@/lib/googleSearchConsole";

export async function GET(req: NextRequest) {
  const admin = await requireAdminUser("site_settings.manage"); if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  const url = new URL(req.url); const code = url.searchParams.get("code") || ""; const state = url.searchParams.get("state") || ""; const saved = req.cookies.get("seo_google_oauth_state")?.value || "";
  if (!code || !state || state !== saved) return NextResponse.json({ error: "Invalid or expired Google OAuth request." }, { status: 400 });
  try { const redirectUri = req.cookies.get("seo_google_redirect_uri")?.value || process.env.GOOGLE_SEARCH_CONSOLE_REDIRECT_URI || `${url.origin}/api/admin/seo-automation/google/callback`; await exchangeSearchConsoleCode(code, redirectUri, admin.user!.id); const response = NextResponse.redirect(new URL("/admin?tab=site_settings&seo=connected", url.origin)); response.cookies.set("seo_google_oauth_state", "", { maxAge: 0, path: "/" }); response.cookies.set("seo_google_redirect_uri", "", { maxAge: 0, path: "/" }); return response; }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to finish Search Console connection." }, { status: 500 }); }
}
