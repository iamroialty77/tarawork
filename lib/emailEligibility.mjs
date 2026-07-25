const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Return a normalized Auth email only after the user proved control of it.
 */
export function getConfirmedAuthEmail(user) {
  if (!user?.email_confirmed_at || typeof user.email !== "string") return "";
  const email = user.email.trim().toLowerCase().slice(0, 320);
  return EMAIL_PATTERN.test(email) ? email : "";
}

