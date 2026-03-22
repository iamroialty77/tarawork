"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

type CallbackStatus = "saving" | "error";

export default function TrelloCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<CallbackStatus>("saving");
  const [message, setMessage] = useState("Connecting your Trello account...");

  useEffect(() => {
    let cancelled = false;

    const completeConnection = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const state = (queryParams.get("state") || "").trim();
      const nextPath = (queryParams.get("next") || "/").trim();
      const token = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("token") || "";

      if (!token) {
        if (!cancelled) {
          setStatus("error");
          setMessage("Missing Trello token in callback.");
        }
        return;
      }

      if (!state) {
        if (!cancelled) {
          setStatus("error");
          setMessage("Missing state parameter in callback.");
        }
        return;
      }

      try {
        const response = await fetch("/api/trello/connection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            state,
            scope: "read,write,account",
          }),
        });

        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to save Trello connection.");
        }

        const finalPath = nextPath.startsWith("/") ? nextPath : "/";
        router.replace(`${finalPath}${finalPath.includes("?") ? "&" : "?"}trello=connected`);
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setMessage(error instanceof Error ? error.message : "Unable to complete Trello connection.");
        }
      }
    };

    void completeConnection();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-6">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">
          {status === "saving" ? "Connecting Trello" : "Trello connection failed"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      </div>
    </main>
  );
}
