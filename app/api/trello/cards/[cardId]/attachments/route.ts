import { NextResponse } from "next/server";
import { TrelloApiError, addAttachmentToTrelloCard } from "@/lib/trello";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { getTrelloCredentialsForUserOrThrow, TrelloConnectionRequiredError } from "@/lib/trelloConnection";

export const runtime = "nodejs";

type AddAttachmentRequestBody = {
  url?: string;
  name?: string;
  setCover?: boolean;
};

function sanitizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export async function POST(req: Request, context: { params: Promise<{ cardId: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { cardId } = await context.params;
    const normalizedCardId = sanitizeText(cardId || "");
    if (!normalizedCardId) {
      return NextResponse.json({ error: "cardId is required." }, { status: 400 });
    }

    const body = (await req.json()) as AddAttachmentRequestBody;
    const url = typeof body.url === "string" ? body.url.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const setCover = typeof body.setCover === "boolean" ? body.setCover : undefined;

    if (!url) {
      return NextResponse.json(
        { error: "Attachment url is required. Trello URL attachments are supported in this endpoint." },
        { status: 400 },
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Attachment url must be a valid absolute URL." }, { status: 400 });
    }

    const credentials = await getTrelloCredentialsForUserOrThrow(user.id);
    const attachment = await addAttachmentToTrelloCard(
      {
        idCard: normalizedCardId,
        url,
        name,
        setCover,
      },
      credentials,
    );

    return NextResponse.json({ success: true, attachment });
  } catch (error) {
    if (error instanceof TrelloConnectionRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof TrelloApiError) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Unable to add Trello attachment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
