import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabase_admin";

export const runtime = "nodejs";

const cleanId = (value: unknown) => String(value || "").trim().slice(0, 80);

export async function PATCH(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });

  try {
    const body = await req.json();
    const id = cleanId(body.id);
    const action = String(body.action || "");
    if (!id || !["read", "unread", "trash", "restore"].includes(action)) {
      return NextResponse.json({ error: "Invalid email action." }, { status: 400 });
    }

    const { data: message, error } = await supabaseAdmin
      .from("email_messages")
      .select("id,direction,status,metadata")
      .eq("id", id)
      .maybeSingle();
    if (error || !message) return NextResponse.json({ error: "Email not found." }, { status: 404 });

    const metadata = message.metadata && typeof message.metadata === "object" ? { ...message.metadata } : {};
    if (action === "read" || action === "unread") metadata.isRead = action === "read";
    if (action === "trash") {
      metadata.trashedAt = new Date().toISOString();
      metadata.previousFolder = message.status === "draft" ? "drafts" : message.direction === "outbound" ? "sent" : "inbox";
    }
    if (action === "restore") delete metadata.trashedAt;

    const { error: updateError } = await supabaseAdmin.from("email_messages").update({ metadata }).eq("id", id);
    if (updateError) throw updateError;
    return NextResponse.json({ success: true, metadata });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update email." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const id = cleanId(new URL(req.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Email id is required." }, { status: 400 });
  const { data: message } = await supabaseAdmin.from("email_messages").select("metadata").eq("id", id).maybeSingle();
  if (!message?.metadata?.trashedAt) return NextResponse.json({ error: "Move the email to Trash first." }, { status: 400 });
  const { error } = await supabaseAdmin.from("email_messages").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
