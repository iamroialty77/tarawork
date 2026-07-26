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
    const origin = url.origin;
    const response = new NextResponse(`<!doctype html><html><body><script>window.opener&&window.opener.postMessage({type:"google-sheets-connected"},${JSON.stringify(origin)});window.close();</script><p>Google Sheets connected. You may close this window.</p></body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8", "Content-Security-Policy": `default-src 'none'; script-src 'unsafe-inline'` } });
    response.cookies.set("google_sheets_oauth_state", "", { maxAge: 0, path: "/" });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to finish Google connection." }, { status: 500 });
  }
}
