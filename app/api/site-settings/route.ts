import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin } from "@/lib/security";
import { getSiteSettings, normalizeSiteSettings, saveSiteSettings } from "@/lib/siteSettings";

export async function GET() {
  try {
    return NextResponse.json({ settings: await getSiteSettings() });
  } catch {
    return NextResponse.json({ error: "Unable to load site settings." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const settings = normalizeSiteSettings(await req.json());
    if (settings.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contactEmail)) {
      return NextResponse.json({ error: "Enter a valid contact email." }, { status: 400 });
    }
    await saveSiteSettings(settings, admin.user!.id);
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save site settings." }, { status: 500 });
  }
}
