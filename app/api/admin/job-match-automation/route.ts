import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin, getClientIp, rateLimit } from "@/lib/security";
import { getJobMatchConfig, getJobMatchRecipients, normalizeJobMatchConfig, saveJobMatchConfig, sendJobMatches } from "@/lib/jobMatchAutomation";

export const runtime = "nodejs";
const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message :
    error && typeof error === "object" && "message" in error ? String(error.message) :
      "Unable to process job matches.";

export async function GET() {
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const config = await getJobMatchConfig();
    const recipients = await getJobMatchRecipients(config, true);
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
    const config = normalizeJobMatchConfig(body.config);
    if (config.enabled && (!config.subject || !config.message)) {
      return NextResponse.json({ error: "Subject and message are required before enabling automation." }, { status: 400 });
    }
    if (action === "save") {
      await saveJobMatchConfig(config, admin.user?.id);
      return NextResponse.json({ success: true, config });
    }
    if (action === "preview") {
      const recipients = await getJobMatchRecipients(config, true);
      return NextResponse.json({ success: true, recipients, recipientCount: recipients.length });
    }
    const limited = rateLimit({ key: `admin:job-match:${admin.user?.id || getClientIp(req)}`, limit: 3, windowMs: 3600000 });
    if (limited) return limited;
    const selectedUserIds: string[] | undefined = Array.isArray(body.selectedUserIds)
      ? [...new Set<string>(
          body.selectedUserIds
            .map((value: unknown): string => String(value))
            .filter((value: string) => /^[0-9a-f-]{36}$/i.test(value)),
        )].slice(0, 200)
      : undefined;
    if (Array.isArray(body.selectedUserIds) && !selectedUserIds?.length) {
      return NextResponse.json({ error: "Select at least one eligible freelancer." }, { status: 400 });
    }
    return NextResponse.json({ success: true, ...await sendJobMatches(config, `admin:${admin.user?.id || "unknown"}`, selectedUserIds) });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
