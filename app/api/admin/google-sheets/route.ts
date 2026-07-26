import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin } from "@/lib/security";
import { disconnectGoogleConnection, googleConnectionStatus, listGoogleSheetTabs, listGoogleSpreadsheets, readGoogleSheet } from "@/lib/googleSheets";

const validId = (value: string) => /^[a-zA-Z0-9_-]{10,200}$/.test(value);

export async function GET(req: NextRequest) {
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const adminId = admin.user!.id;
    const url = new URL(req.url);
    const spreadsheetId = url.searchParams.get("spreadsheetId") || "";
    const sheetName = (url.searchParams.get("sheetName") || "").slice(0, 200);
    const status = await googleConnectionStatus(adminId);
    if (!spreadsheetId) return NextResponse.json({ ...status, spreadsheets: status.connected ? await listGoogleSpreadsheets(adminId) : [] });
    if (!validId(spreadsheetId)) return NextResponse.json({ error: "Invalid spreadsheet ID." }, { status: 400 });
    if (!sheetName) return NextResponse.json(await listGoogleSheetTabs(spreadsheetId, adminId));
    return NextResponse.json(await readGoogleSheet(spreadsheetId, sheetName, adminId));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to read Google Sheets." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    await disconnectGoogleConnection(admin.user!.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to disconnect Google Sheets." }, { status: 500 });
  }
}
