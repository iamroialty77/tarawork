import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { googleAuthorizationUrl } from "@/lib/googleSheets";

export async function GET(req: NextRequest) {
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const state = crypto.randomBytes(24).toString("hex");
    const origin = new URL(req.url).origin;
    const redirectUri = `${origin}/api/admin/google-sheets/callback`;
    const response = NextResponse.redirect(googleAuthorizationUrl(state, redirectUri));
    response.cookies.set("google_sheets_oauth_state", state, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/" });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to connect Google Sheets." }, { status: 500 });
  }
}
