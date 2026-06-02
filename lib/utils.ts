import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  
  return date.toLocaleDateString();
}

export function formatPostAge(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (!Number.isFinite(diffInSeconds) || diffInSeconds < 0) return "New";
  const diffInDays = Math.floor(diffInSeconds / 86400);
  if (diffInDays < 7) return "New";

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 8) return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"}`;

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"}`;
}

export const energyScore = (userEnergy?: string, jobEnergy?: string) => {
  const u = (userEnergy || "Balanced").toLowerCase();
  const j = (jobEnergy || "Balanced").toLowerCase();
  if (u === j) return 100;
  if ((u === "high" && j === "balanced") || (u === "balanced" && j === "low") || (u === "low" && j === "balanced")) return 80;
  if ((u === "high" && j === "low") || (u === "low" && j === "high")) return 50;
  return 70;
};
