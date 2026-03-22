import { NextResponse } from "next/server";
import { TrelloApiError, getTrelloBoardLists } from "@/lib/trello";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { getTrelloCredentialsForUserOrEnv } from "@/lib/trelloConnection";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const idBoard = (searchParams.get("idBoard") || "").trim();

    if (!idBoard) {
      return NextResponse.json({ error: "idBoard is required." }, { status: 400 });
    }

    const credentials = await getTrelloCredentialsForUserOrEnv(user.id);
    const lists = await getTrelloBoardLists(idBoard, credentials);
    return NextResponse.json({ lists });
  } catch (error) {
    if (error instanceof TrelloApiError) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Unable to load Trello lists.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
