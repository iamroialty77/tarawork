import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { exchangeGoogleCode, saveGoogleConnection } from "@/lib/googleSheets";

export async function GET(req: NextRequest) {
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  const url = new URL(req.url);
  const code = url.searchParams.get("code") || "";
  const state = url.searchParams.get("state") || "";
  const savedState = req.cookies.get("google_sheets_oauth_state")?.value || "";
  if (!code || !state || !savedState || state !== savedState) return NextResponse.json({ error: "Invalid or expired Google OAuth request." }, { status: 400 });
  try {
    const refreshToken = await exchangeGoogleCode(code);
    await saveGoogleConnection(refreshToken, admin.user!.id);
    const response = NextResponse.redirect(new URL("/admin?tab=automation&open=csv-email&googleSheets=connected", url.origin));
    response.cookies.set("google_sheets_oauth_state", "", { maxAge: 0, path: "/" });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to finish Google connection." }, { status: 500 });
  }
}
