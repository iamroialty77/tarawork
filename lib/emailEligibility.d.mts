export type AuthEmailUser = {
  email?: string | null;
  email_confirmed_at?: string | null;
};

export function getConfirmedAuthEmail(user: AuthEmailUser | null | undefined): string;

