import { NextResponse } from "next/server";
import {
  getMilestoneIdFromPullRequest,
  verifyGitHubWebhookSignature,
} from "@/lib/githubWebhook.mjs";
import { financialService } from "@/lib/services/financialService";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const contentLength = Number(req.headers.get("content-length") || "0");
    if (Number.isFinite(contentLength) && contentLength > 1_000_000) {
      return NextResponse.json({ error: "Webhook payload is too large." }, { status: 413 });
    }

    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[GitHub webhook] GITHUB_WEBHOOK_SECRET is not configured.");
      return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
    }

    const rawBody = await req.text();
    if (Buffer.byteLength(rawBody, "utf8") > 1_000_000) {
      return NextResponse.json({ error: "Webhook payload is too large." }, { status: 413 });
    }
    const signature = req.headers.get("x-hub-signature-256");
    if (!verifyGitHubWebhookSignature({ rawBody, signature, secret })) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
    }

    if (req.headers.get("x-github-event") !== "pull_request") {
      return NextResponse.json({ message: "Event ignored." }, { status: 202 });
    }

    const payload = JSON.parse(rawBody) as {
      action?: string;
      pull_request?: {
        merged?: boolean;
        head?: { ref?: string };
      };
    };
    const isMergedPullRequest = payload.action === "closed" && payload.pull_request?.merged === true;
    if (!isMergedPullRequest) {
      return NextResponse.json({ message: "Event ignored." }, { status: 202 });
    }

    const milestoneId = getMilestoneIdFromPullRequest(payload);
    if (!milestoneId) {
      return NextResponse.json({ error: "Invalid milestone identifier." }, { status: 400 });
    }

    if (process.env.GITHUB_FINANCIAL_WEBHOOK_ENABLED !== "true") {
      console.warn(`[GitHub webhook] Verified milestone ${milestoneId}; financial automation is disabled.`);
      return NextResponse.json(
        { message: "Webhook verified; financial automation is disabled." },
        { status: 202 },
      );
    }

    const success = await financialService.releaseMilestonePayment(milestoneId);
    if (!success) {
      return NextResponse.json({ error: "Milestone release failed." }, { status: 502 });
    }

    return NextResponse.json({
      message: "Milestone payment release processed.",
      milestoneId,
      status: "success",
    });
  } catch (error) {
    console.error("[GitHub webhook] Processing failed.", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
