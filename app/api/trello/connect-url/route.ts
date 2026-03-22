import crypto from "crypto";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase_server";

export const runtime = "nodejs";

function getBaseAppUrl(requestUrl: string) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  return new URL(requestUrl).origin;
}

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const nextPath = (searchParams.get("next") || "/").trim();
    const tokenExpiration = (searchParams.get("expiration") || "30days").trim();
    const key = process.env.TRELLO_API_KEY;

    if (!key) {
      return NextResponse.json({ error: "TRELLO_API_KEY is not configured." }, { status: 500 });
    }

    const state = crypto.randomBytes(16).toString("hex");
    const baseAppUrl = getBaseAppUrl(req.url);
    const callbackUrl = new URL(`${baseAppUrl}/trello/callback`);
    callbackUrl.searchParams.set("state", state);
    callbackUrl.searchParams.set("next", nextPath.startsWith("/") ? nextPath : "/");

    const authorizeUrl = new URL("https://trello.com/1/authorize");
    authorizeUrl.searchParams.set("expiration", tokenExpiration);
    authorizeUrl.searchParams.set("name", "TaraWork");
    authorizeUrl.searchParams.set("scope", "read,write,account");
    authorizeUrl.searchParams.set("response_type", "token");
    authorizeUrl.searchParams.set("callback_method", "fragment");
    authorizeUrl.searchParams.set("key", key);
    authorizeUrl.searchParams.set("return_url", callbackUrl.toString());

    const response = NextResponse.json({ authorizeUrl: authorizeUrl.toString() });
    response.cookies.set("trello_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10,
      path: "/",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate Trello connect URL.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
