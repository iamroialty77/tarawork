import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { exchangeGoogleCode, saveGoogleConnection } from "@/lib/googleSheets";
import { exchangeSearchConsoleCode } from "@/lib/googleSearchConsole";

export async function GET(req: NextRequest) {
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  const url = new URL(req.url);
  const code = url.searchParams.get("code") || "";
  const state = url.searchParams.get("state") || "";
  const seoState = req.cookies.get("seo_google_oauth_state")?.value || "";
  if (code && state && seoState && state === seoState) {
    if (!admin.permissions?.includes("site_settings.manage")) return NextResponse.json({ error: "You do not have permission to configure SEO integrations." }, { status: 403 });
    try {
      const redirectUri = req.cookies.get("seo_google_redirect_uri")?.value || process.env.GOOGLE_REDIRECT_URI || `${url.origin}/api/admin/google-sheets/callback`;
      await exchangeSearchConsoleCode(code, redirectUri, admin.user!.id);
      const response = NextResponse.redirect(new URL("/admin?tab=site_settings&seo=connected", url.origin));
      response.cookies.set("seo_google_oauth_state", "", { maxAge: 0, path: "/" });
      response.cookies.set("seo_google_redirect_uri", "", { maxAge: 0, path: "/" });
      return response;
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to finish Search Console connection." }, { status: 500 });
    }
  }
  if (!admin.permissions?.includes("automation.manage")) return NextResponse.json({ error: "You do not have permission to configure Google Sheets." }, { status: 403 });
  const savedState = req.cookies.get("google_sheets_oauth_state")?.value || "";
  if (!code || !state || !savedState || state !== savedState) return NextResponse.json({ error: "Invalid or expired Google OAuth request." }, { status: 400 });
  try {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${url.origin}/api/admin/google-sheets/callback`;
    const refreshToken = await exchangeGoogleCode(code, redirectUri);
    await saveGoogleConnection(refreshToken, admin.user!.id);
    const response = NextResponse.redirect(new URL("/admin?tab=automation&open=csv-email&googleSheets=connected", url.origin));
    response.cookies.set("google_sheets_oauth_state", "", { maxAge: 0, path: "/" });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to finish Google connection." }, { status: 500 });
  }
}
