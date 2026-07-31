import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { searchConsoleAuthorizationUrl } from "@/lib/googleSearchConsole";

export async function GET(req: NextRequest) {
  const admin = await requireAdminUser("site_settings.manage"); if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const state = crypto.randomBytes(24).toString("hex");
    const origin = new URL(req.url).origin;
    // Reuse the already-registered Google Sheets callback unless a dedicated
    // Search Console redirect URI is explicitly configured.
    const redirectUri = process.env.GOOGLE_SEARCH_CONSOLE_REDIRECT_URI
      || process.env.GOOGLE_REDIRECT_URI
      || `${origin}/api/admin/seo-automation/google/callback`;
    const response = NextResponse.redirect(searchConsoleAuthorizationUrl(state, redirectUri));
    const cookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/" };
    response.cookies.set("seo_google_oauth_state", state, cookieOptions);
    response.cookies.set("seo_google_redirect_uri", redirectUri, cookieOptions);
    return response;
  }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to connect Search Console." }, { status: 500 }); }
}
