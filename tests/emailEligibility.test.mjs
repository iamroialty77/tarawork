import assert from "node:assert/strict";
import test from "node:test";
import { getConfirmedAuthEmail } from "../lib/emailEligibility.mjs";

test("returns a normalized confirmed Auth email", () => {
  assert.equal(
    getConfirmedAuthEmail({
      email: "  Legit.User@Example.COM ",
      email_confirmed_at: "2026-07-25T00:00:00.000Z",
    }),
    "legit.user@example.com",
  );
});

test("rejects unconfirmed and malformed addresses", () => {
  assert.equal(getConfirmedAuthEmail({ email: "bot@example.com", email_confirmed_at: null }), "");
  assert.equal(
    getConfirmedAuthEmail({
      email: "not-an-email",
      email_confirmed_at: "2026-07-25T00:00:00.000Z",
    }),
    "",
  );
});

