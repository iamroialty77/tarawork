import { NextResponse } from "next/server";
import { TrelloApiError, updateTrelloCard } from "@/lib/trello";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { getTrelloCredentialsForUserOrThrow, TrelloConnectionRequiredError } from "@/lib/trelloConnection";

export const runtime = "nodejs";

type UpdateCardRequestBody = {
  name?: string;
  description?: string;
  due?: string;
  idList?: string;
  closed?: boolean;
  idMembers?: string[];
  idLabels?: string[];
};

function sanitizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export async function PATCH(req: Request, context: { params: Promise<{ cardId: string }> }) {
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

    const body = (await req.json()) as UpdateCardRequestBody;
    const name = typeof body.name === "string" ? sanitizeText(body.name) : undefined;
    const description = typeof body.description === "string" ? body.description.trim() : undefined;
    const due = typeof body.due === "string" ? body.due.trim() : undefined;
    const idList = typeof body.idList === "string" ? sanitizeText(body.idList) : undefined;
    const closed = typeof body.closed === "boolean" ? body.closed : undefined;
    const idMembers = Array.isArray(body.idMembers) ? body.idMembers : undefined;
    const idLabels = Array.isArray(body.idLabels) ? body.idLabels : undefined;

    if (!name && !description && !due && !idList && typeof closed !== "boolean" && !idMembers && !idLabels) {
      return NextResponse.json(
        { error: "At least one field is required to update the Trello card." },
        { status: 400 },
      );
    }

    const credentials = await getTrelloCredentialsForUserOrThrow(user.id);
    const card = await updateTrelloCard(
      {
        idCard: normalizedCardId,
        name,
        description,
        due,
        idList,
        closed,
        idMembers,
        idLabels,
      },
      credentials,
    );

    return NextResponse.json({ success: true, card });
  } catch (error) {
    if (error instanceof TrelloConnectionRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof TrelloApiError) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Unable to update Trello card.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
