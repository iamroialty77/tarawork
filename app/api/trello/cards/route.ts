import { NextResponse } from "next/server";
import { TrelloApiError, createTrelloCard } from "@/lib/trello";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { getTrelloCredentialsForUserOrEnv } from "@/lib/trelloConnection";

export const runtime = "nodejs";

type CreateCardRequestBody = {
  idList?: string;
  name?: string;
  description?: string;
  due?: string;
  idMembers?: string[];
  idLabels?: string[];
};

function sanitizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await req.json()) as CreateCardRequestBody;
    const idList = sanitizeText(body.idList || "");
    const name = sanitizeText(body.name || "");
    const description = typeof body.description === "string" ? body.description.trim() : undefined;
    const due = typeof body.due === "string" ? body.due.trim() : undefined;
    const idMembers = Array.isArray(body.idMembers) ? body.idMembers : undefined;
    const idLabels = Array.isArray(body.idLabels) ? body.idLabels : undefined;

    if (!idList) {
      return NextResponse.json({ error: "idList is required." }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: "name is required." }, { status: 400 });
    }

    const credentials = await getTrelloCredentialsForUserOrEnv(user.id);
    const card = await createTrelloCard(
      {
        idList,
        name,
        description,
        due,
        idMembers,
        idLabels,
      },
      credentials,
    );

    return NextResponse.json({
      success: true,
      card,
    });
  } catch (error) {
    if (error instanceof TrelloApiError) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Unable to create Trello card.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
