import { NextResponse } from "next/server";
import { TrelloApiError, addCommentToTrelloCard } from "@/lib/trello";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { getTrelloCredentialsForUserOrThrow, TrelloConnectionRequiredError } from "@/lib/trelloConnection";

export const runtime = "nodejs";

type AddCommentRequestBody = {
  text?: string;
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

    const body = (await req.json()) as AddCommentRequestBody;
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) {
      return NextResponse.json({ error: "Comment text is required." }, { status: 400 });
    }

    const credentials = await getTrelloCredentialsForUserOrThrow(user.id);
    const action = await addCommentToTrelloCard(normalizedCardId, text, credentials);

    return NextResponse.json({ success: true, action });
  } catch (error) {
    if (error instanceof TrelloConnectionRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof TrelloApiError) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Unable to add Trello comment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
