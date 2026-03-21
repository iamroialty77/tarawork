import { supabase } from "./supabase";

export const DEFAULT_JOB_CATEGORIES = [
  "General",
  "Developer",
  "Designer",
  "Graphic Design",
  "Writer",
  "Marketing Specialist",
  "Marketing",
  "Virtual Assistant",
  "Admin/VA",
  "Customer Support",
  "Sales",
  "Project Management",
  "QA/Testing",
  "Data Entry",
  "Finance/Accounting",
  "IT & Networking",
  "Writing & Content",
  "Data & Automation",
  "Other",
] as const;

export async function fetchJobCategoryOptions(): Promise<string[]> {
  const { data, error } = await supabase
    .from("job_categories")
    .select("name")
    .order("name", { ascending: true });

  if (error || !data || data.length === 0) {
    return [...DEFAULT_JOB_CATEGORIES];
  }

  const normalized = data
    .map((row: { name: string | null }) => (typeof row.name === "string" ? row.name.trim() : ""))
    .filter((name: string) => !!name);

  return normalized.length > 0 ? normalized : [...DEFAULT_JOB_CATEGORIES];
}
