export type GitHubWebhookVerificationInput = {
  rawBody: string;
  signature: string | null;
  secret: string;
};

export function verifyGitHubWebhookSignature(
  input: GitHubWebhookVerificationInput,
): boolean;

export function getMilestoneIdFromPullRequest(payload: unknown): string | null;

