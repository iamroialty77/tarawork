import { NextResponse } from "next/server";
import { TrelloApiError, createTrelloBoard, getTrelloBoards } from "@/lib/trello";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { getTrelloCredentialsForUserOrThrow, TrelloConnectionRequiredError } from "@/lib/trelloConnection";

export const runtime = "nodejs";

type CreateBoardRequestBody = {
  name?: string;
  description?: string;
  permissionLevel?: "private" | "org" | "public";
  defaultLists?: boolean;
  defaultLabels?: boolean;
};

function sanitizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

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

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await req.json()) as CreateBoardRequestBody;
    const name = sanitizeText(body.name || "");
    const description = typeof body.description === "string" ? body.description.trim() : undefined;
    const permissionLevel =
      body.permissionLevel === "private" || body.permissionLevel === "org" || body.permissionLevel === "public"
        ? body.permissionLevel
        : "private";
    const defaultLists = typeof body.defaultLists === "boolean" ? body.defaultLists : true;
    const defaultLabels = typeof body.defaultLabels === "boolean" ? body.defaultLabels : true;

    if (!name) {
      return NextResponse.json({ error: "name is required." }, { status: 400 });
    }

    const credentials = await getTrelloCredentialsForUserOrThrow(user.id);
    const board = await createTrelloBoard(
      {
        name,
        description,
        permissionLevel,
        defaultLists,
        defaultLabels,
      },
      credentials,
    );

    return NextResponse.json({ success: true, board });
  } catch (error) {
    if (error instanceof TrelloConnectionRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof TrelloApiError) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Unable to create Trello board.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
