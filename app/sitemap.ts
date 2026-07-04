import type { MetadataRoute } from "next";
import { createJobShareToken } from "@/lib/jobShare";
import { absoluteUrl } from "@/lib/seo";
import { supabaseAdmin } from "@/lib/supabase_admin";

export const dynamic = "force-dynamic";

type SitemapEntry = MetadataRoute.Sitemap[number];

const safeDate = (value: unknown) => {
  if (typeof value !== "string") return new Date();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: SitemapEntry[] = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/hire-filipino-freelancers"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/virtual-assistant-philippines"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/remote-jobs-philippines"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const [{ data: jobs }, { data: profiles }] = await Promise.all([
    supabaseAdmin
      .from("jobs")
      .select("id, title, updated_at, created_at")
      .eq("status", "live")
      .order("created_at", { ascending: false })
      .limit(1000),
    supabaseAdmin
      .from("profiles")
      .select("id, username, role, updated_at, created_at")
      .neq("role", "admin")
      .order("updated_at", { ascending: false })
      .limit(1000),
  ]);

  const jobRoutes: SitemapEntry[] = (jobs || [])
    .filter((job) => job.id && job.title)
    .map((job) => ({
      url: absoluteUrl(`/jobs/${createJobShareToken({ id: job.id, title: job.title })}`),
      lastModified: safeDate(job.updated_at || job.created_at),
      changeFrequency: "daily",
      priority: 0.8,
    }));

  const profileRoutes: SitemapEntry[] = (profiles || [])
    .map((profile) => ({
      id: profile.id,
      slug: profile.username || profile.id,
      role: profile.role,
      lastModified: profile.updated_at || profile.created_at,
    }))
    .filter((profile) => profile.slug && profile.role !== "admin")
    .map((profile) => ({
      url: absoluteUrl(`/${encodeURIComponent(profile.slug)}`),
      lastModified: safeDate(profile.lastModified),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...jobRoutes, ...profileRoutes];
}
