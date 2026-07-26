import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin, getClientIp, rateLimit } from "@/lib/security";
import {
  getProfileReminderConfig,
  getProfileReminderRecipients,
  normalizeProfileReminderConfig,
  saveProfileReminderConfig,
  sendProfileReminders,
} from "@/lib/profileReminderAutomation";

export const runtime = "nodejs";
const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message :
    error && typeof error === "object" && "message" in error ? String(error.message) :
      "Unable to process profile reminders.";

export async function GET() {
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const config = await getProfileReminderConfig();
    const recipients = await getProfileReminderRecipients(config, true);
    return NextResponse.json({ config, recipients, recipientCount: recipients.length });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const body = await req.json();
    const action = body.action === "run" ? "run" : body.action === "preview" ? "preview" : "save";
    const config = normalizeProfileReminderConfig(body.config);
    if (config.enabled && (!config.subject || !config.message)) {
      return NextResponse.json({ error: "Subject and message are required before enabling automation." }, { status: 400 });
    }
    if (action === "save") {
      await saveProfileReminderConfig(config, admin.user?.id);
      return NextResponse.json({ success: true, config });
    }
    if (action === "preview") {
      const recipients = await getProfileReminderRecipients(config, true);
      return NextResponse.json({ success: true, recipients, recipientCount: recipients.length });
    }
    const limited = rateLimit({
      key: `admin:profile-reminder:${admin.user?.id || getClientIp(req)}`,
      limit: 3,
      windowMs: 60 * 60 * 1000,
    });
    if (limited) return limited;
    const result = await sendProfileReminders(config, `admin:${admin.user?.id || "unknown"}`);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
