export const PREMIUM_MONTHLY_CREDITS = 10;
export const PREMIUM_TOPUP_CREDITS = 10;

export const PREMIUM_CREDIT_COSTS = {
  smart_match: 1,
  portfolio_generate: 1,
  career_roadmap: 2,
  interview_summary: 2,
} as const;

export type PremiumCreditAction = keyof typeof PREMIUM_CREDIT_COSTS;
