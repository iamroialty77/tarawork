import { NextResponse } from "next/server";
import { TrelloApiError, getTrelloBoards } from "@/lib/trello";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { getTrelloCredentialsForUserOrThrow, TrelloConnectionRequiredError } from "@/lib/trelloConnection";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const credentials = await getTrelloCredentialsForUserOrThrow(user.id);
    const boards = await getTrelloBoards(credentials);
    return NextResponse.json({ boards });
  } catch (error) {
    if (error instanceof TrelloConnectionRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof TrelloApiError) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Unable to load Trello boards.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
