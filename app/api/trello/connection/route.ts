import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { deleteTrelloConnection, getStoredTrelloConnection, saveTrelloConnection } from "@/lib/trelloConnection";
import { getTrelloMember, TrelloApiError } from "@/lib/trello";

export const runtime = "nodejs";

type SaveConnectionRequestBody = {
  token?: string;
  state?: string;
  scope?: string;
  expiresAt?: string | null;
};

function clearOauthStateCookie(response: NextResponse) {
  response.cookies.set("trello_oauth_state", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const connection = await getStoredTrelloConnection(user.id);
    return NextResponse.json({
      connected: !!connection,
      connection: connection
        ? {
            memberId: connection.trello_member_id,
            username: connection.trello_username,
            fullName: connection.trello_full_name,
            scope: connection.token_scope,
            expiresAt: connection.token_expires_at,
            createdAt: connection.created_at,
            updatedAt: connection.updated_at,
          }
        : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch Trello connection.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await req.json()) as SaveConnectionRequestBody;
    const token = (body.token || "").trim();
    const state = (body.state || "").trim();
    const scope = (body.scope || "").trim();
    const expiresAt = typeof body.expiresAt === "string" ? body.expiresAt.trim() : null;

    if (!token) {
      return NextResponse.json({ error: "Missing Trello token." }, { status: 400 });
    }

    if (!state) {
      return NextResponse.json({ error: "Missing Trello connect state." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const storedState = cookieStore.get("trello_oauth_state")?.value;
    if (!storedState || storedState !== state) {
      const invalidResponse = NextResponse.json({ error: "Invalid Trello connect state." }, { status: 400 });
      clearOauthStateCookie(invalidResponse);
      return invalidResponse;
    }

    const key = process.env.TRELLO_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "TRELLO_API_KEY is not configured." }, { status: 500 });
    }

    const member = await getTrelloMember({ key, token });

    await saveTrelloConnection({
      userId: user.id,
      memberId: member.id,
      username: member.username,
      fullName: member.fullName,
      token,
      scope: scope || "read,write,account",
      expiresAt,
    });

    const response = NextResponse.json({
      connected: true,
      connection: {
        memberId: member.id,
        username: member.username,
        fullName: member.fullName,
      },
    });
    clearOauthStateCookie(response);
    return response;
  } catch (error) {
    if (error instanceof TrelloApiError) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Unable to save Trello connection.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await deleteTrelloConnection(user.id);

    return NextResponse.json({ connected: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to disconnect Trello.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
