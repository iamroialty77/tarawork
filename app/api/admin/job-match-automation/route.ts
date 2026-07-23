import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin, getClientIp, rateLimit } from "@/lib/security";
import { getJobMatchConfig, getJobMatchRecipients, normalizeJobMatchConfig, saveJobMatchConfig, sendJobMatches } from "@/lib/jobMatchAutomation";

export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const config = await getJobMatchConfig();
    const recipients = await getJobMatchRecipients(config, true);
    return NextResponse.json({ config, recipients, recipientCount: recipients.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load job match automation." }, { status: 500 });
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
    const config = normalizeJobMatchConfig(body.config);
    if (config.enabled && (!config.subject || !config.message)) {
      return NextResponse.json({ error: "Subject and message are required before enabling automation." }, { status: 400 });
    }
    if (action === "save") {
      await saveJobMatchConfig(config, admin.user?.id);
      return NextResponse.json({ success: true, config });
    }
    const recipients = await getJobMatchRecipients(config, true);
    if (action === "preview") return NextResponse.json({ success: true, recipients, recipientCount: recipients.length });
    const limited = rateLimit({ key: `admin:job-match:${admin.user?.id || getClientIp(req)}`, limit: 3, windowMs: 3600000 });
    if (limited) return limited;
    return NextResponse.json({ success: true, ...await sendJobMatches(config, `admin:${admin.user?.id || "unknown"}`) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to process job matches." }, { status: 500 });
  }
}
