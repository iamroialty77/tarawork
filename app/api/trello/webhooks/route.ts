import { NextResponse } from "next/server";
import { createTrelloWebhook, deleteTrelloWebhook, listTrelloWebhooks, TrelloApiError } from "@/lib/trello";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { getTrelloCredentialsForUserOrThrow, TrelloConnectionRequiredError } from "@/lib/trelloConnection";
import { buildTrelloWebhookCallbackUrl } from "@/lib/trelloWebhook";

export const runtime = "nodejs";

type CreateWebhookRequestBody = {
  idModel?: string;
  description?: string;
};

type DeleteWebhookRequestBody = {
  webhookId?: string;
};

function sanitizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const credentials = await getTrelloCredentialsForUserOrThrow(user.id);
    const webhooks = await listTrelloWebhooks(credentials);
    const callbackUrl = buildTrelloWebhookCallbackUrl({
      requestUrl: req.url,
      userId: user.id,
    });

    return NextResponse.json({ webhooks, callbackUrl });
  } catch (error) {
    if (error instanceof TrelloConnectionRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof TrelloApiError) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Unable to load Trello webhooks.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await req.json()) as CreateWebhookRequestBody;
    const idModel = sanitizeText(body.idModel || "");
    const description = typeof body.description === "string" ? body.description.trim() : undefined;

    if (!idModel) {
      return NextResponse.json({ error: "idModel is required (board or card ID)." }, { status: 400 });
    }

    const callbackURL = buildTrelloWebhookCallbackUrl({
      requestUrl: req.url,
      userId: user.id,
    });
    const credentials = await getTrelloCredentialsForUserOrThrow(user.id);
    const webhook = await createTrelloWebhook(
      {
        callbackURL,
        idModel,
        description: description || `TaraWork webhook for ${idModel}`,
      },
      credentials,
    );

    return NextResponse.json({ success: true, webhook, callbackURL });
  } catch (error) {
    if (error instanceof TrelloConnectionRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof TrelloApiError) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Unable to create Trello webhook.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await req.json()) as DeleteWebhookRequestBody;
    const webhookId = sanitizeText(body.webhookId || "");
    if (!webhookId) {
      return NextResponse.json({ error: "webhookId is required." }, { status: 400 });
    }

    const credentials = await getTrelloCredentialsForUserOrThrow(user.id);
    await deleteTrelloWebhook(webhookId, credentials);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof TrelloConnectionRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof TrelloApiError) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Unable to delete Trello webhook.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
