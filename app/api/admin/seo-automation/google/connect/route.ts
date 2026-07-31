import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { searchConsoleAuthorizationUrl } from "@/lib/googleSearchConsole";

export async function GET(req: NextRequest) {
  const admin = await requireAdminUser("site_settings.manage"); if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try { const state = crypto.randomBytes(24).toString("hex"); const origin = new URL(req.url).origin; const redirectUri = process.env.GOOGLE_SEARCH_CONSOLE_REDIRECT_URI || `${origin}/api/admin/seo-automation/google/callback`; const response = NextResponse.redirect(searchConsoleAuthorizationUrl(state, redirectUri)); response.cookies.set("seo_google_oauth_state", state, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/" }); return response; }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to connect Search Console." }, { status: 500 }); }
}
