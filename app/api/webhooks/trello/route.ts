import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase_admin";
import { verifyTrelloWebhookSignature } from "@/lib/trelloWebhook";

export const runtime = "nodejs";

type TrelloWebhookPayload = {
  action?: {
    id?: string;
    type?: string;
    date?: string;
    data?: Record<string, unknown>;
    memberCreator?: {
      id?: string;
      username?: string;
      fullName?: string;
    };
  };
  model?: {
    id?: string;
    name?: string;
    closed?: boolean;
    idBoard?: string;
  };
  webhook?: {
    id?: string;
    description?: string;
    callbackURL?: string;
    active?: boolean;
  };
};

async function persistWebhookEvent({
  userId,
  payload,
}: {
  userId: string | null;
  payload: TrelloWebhookPayload;
}) {
  const { error } = await supabaseAdmin.from("trello_webhook_events").insert([
    {
      user_id: userId,
      webhook_id: payload.webhook?.id || null,
      action_id: payload.action?.id || null,
      action_type: payload.action?.type || null,
      model_id: payload.model?.id || null,
      payload: payload as unknown as Record<string, unknown>,
      received_at: new Date().toISOString(),
    },
  ]);

  if (error && error.code !== "PGRST205" && error.code !== "42P01") {
    throw new Error(`Unable to persist Trello webhook event: ${error.message}`);
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signatureHeader = req.headers.get("x-trello-webhook");
    const callbackUrl = req.url;
    const isValid = verifyTrelloWebhookSignature({
      rawBody,
      callbackUrl,
      signatureHeader,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid Trello webhook signature." }, { status: 401 });
    }

    const payload = (rawBody ? JSON.parse(rawBody) : {}) as TrelloWebhookPayload;
    const url = new URL(req.url);
    const userId = (url.searchParams.get("userId") || "").trim() || null;

    await persistWebhookEvent({ userId, payload });

    return NextResponse.json({
      ok: true,
      actionType: payload.action?.type || null,
      modelId: payload.model?.id || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Trello webhook processing failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
