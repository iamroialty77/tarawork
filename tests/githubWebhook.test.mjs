import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import {
  getMilestoneIdFromPullRequest,
  verifyGitHubWebhookSignature,
} from "../lib/githubWebhook.mjs";

const secret = "test-secret-that-is-at-least-32-characters";
const rawBody = JSON.stringify({ action: "closed" });
const validSignature = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;

test("accepts a valid GitHub webhook signature", () => {
  assert.equal(
    verifyGitHubWebhookSignature({ rawBody, signature: validSignature, secret }),
    true,
  );
});

test("rejects tampered payloads and malformed signatures", () => {
  assert.equal(
    verifyGitHubWebhookSignature({
      rawBody: `${rawBody} `,
      signature: validSignature,
      secret,
    }),
    false,
  );
  assert.equal(
    verifyGitHubWebhookSignature({ rawBody, signature: "invalid", secret }),
    false,
  );
});

test("rejects weak or missing webhook secrets", () => {
  assert.equal(
    verifyGitHubWebhookSignature({ rawBody, signature: validSignature, secret: "short" }),
    false,
  );
});

test("only accepts bounded milestone branch identifiers", () => {
  assert.equal(
    getMilestoneIdFromPullRequest({ pull_request: { head: { ref: "milestone/ABC-123" } } }),
    "milestone/ABC-123",
  );
  assert.equal(
    getMilestoneIdFromPullRequest({ pull_request: { head: { ref: "../../unsafe value" } } }),
    null,
  );
});

