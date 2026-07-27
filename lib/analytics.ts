"use client";

type AnalyticsParameters = Record<string, string | number | boolean | undefined>;

export function trackConversion(
  eventName: "sign_up" | "login" | "job_apply" | "job_post",
  parameters: AnalyticsParameters = {},
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, parameters);
}
