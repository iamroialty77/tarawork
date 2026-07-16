import { supabaseAdmin } from "@/lib/supabase_admin";

type EmailLogInput = {
  type: string;
  direction?: "inbound" | "outbound";
  fromEmail?: string;
  fromName?: string;
  toEmail?: string;
  replyTo?: string;
  subject: string;
  textBody: string;
  htmlBody?: string;
  status?: "sent" | "failed" | "queued";
  relatedTable?: string;
  relatedId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function logEmailMessage(input: EmailLogInput) {
  try {
    const { error } = await supabaseAdmin.from("email_messages").insert([
      {
        type: input.type,
        direction: input.direction || "inbound",
        from_email: input.fromEmail || null,
        from_name: input.fromName || null,
        to_email: input.toEmail || null,
        reply_to: input.replyTo || null,
        subject: input.subject,
        text_body: input.textBody,
        html_body: input.htmlBody || null,
        status: input.status || "sent",
        related_table: input.relatedTable || null,
        related_id: input.relatedId || null,
        metadata: input.metadata || {},
      },
    ]);

    if (error) {
      console.warn("Email message was sent but not logged:", error.message);
    }
  } catch (error) {
    console.warn("Email message log skipped:", error instanceof Error ? error.message : error);
  }
}
