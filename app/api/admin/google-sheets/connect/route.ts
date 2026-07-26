import crypto from "crypto";
import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { googleAuthorizationUrl } from "@/lib/googleSheets";

export async function GET() {
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const state = crypto.randomBytes(24).toString("hex");
    const response = NextResponse.redirect(googleAuthorizationUrl(state));
    response.cookies.set("google_sheets_oauth_state", state, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/" });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to connect Google Sheets." }, { status: 500 });
  }
}
