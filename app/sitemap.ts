import type { MetadataRoute } from "next";
import { createJobShareToken } from "@/lib/jobShare";
import { absoluteUrl } from "@/lib/seo";
import { supabaseAdmin } from "@/lib/supabase_admin";
import { getPublishedBlogPosts } from "@/lib/blogData";
import { getProfileSlug } from "@/lib/profileUrl";

export const revalidate = 3600;

type SitemapEntry = MetadataRoute.Sitemap[number];

const safeDate = (value: unknown): Date | undefined => {
  if (typeof value !== "string") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: SitemapEntry[] = [
    {
      url: absoluteUrl("/"),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/blog"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...["/about", "/safety", "/privacy", "/terms", "/cookies", "/payment-policy", "/contact"].map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly" as const,
      priority: path === "/safety" || path === "/about" ? 0.8 : 0.65,
    })),
    {
      url: absoluteUrl("/hire-filipino-freelancers"),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/hire/request"),
      changeFrequency: "weekly",
      priority: 0.96,
    },
    {
      url: absoluteUrl("/virtual-assistant-philippines"),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/remote-jobs-philippines"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/hire-filipino-web-developer"),
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: absoluteUrl("/hire-filipino-social-media-manager"),
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: absoluteUrl("/virtual-assistant-rates-philippines"),
      changeFrequency: "weekly",
      priority: 0.86,
    },
    {
      url: absoluteUrl("/top-remote-jobs-for-filipinos-2026"),
      changeFrequency: "weekly",
      priority: 0.86,
    },
    {
      url: absoluteUrl("/how-to-hire-online-filipino-talent-safely"),
      changeFrequency: "weekly",
      priority: 0.86,
    },
    {
      url: absoluteUrl("/flexible-remote-jobs-for-filipino-students"),
      changeFrequency: "weekly",
      priority: 0.84,
    },
    {
      url: absoluteUrl("/best-freelance-niche-philippines"),
      changeFrequency: "weekly",
      priority: 0.84,
    },
  ];

  const publishedBlogPosts = await getPublishedBlogPosts();
  const blogRoutes: SitemapEntry[] = publishedBlogPosts.map((post) => ({
    url: absoluteUrl(post.href),
    lastModified: safeDate(post.modifiedAt || post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.78,
  }));

  const [jobsResult, profilesResult] = await Promise.all([
    supabaseAdmin
      .from("jobs")
      .select("id, title, createdAt")
      .eq("status", "live")
      .order("createdAt", { ascending: false })
      .limit(1000),
    supabaseAdmin
      .from("profiles")
      .select("id, username, role, status, updated_at")
      .neq("role", "admin")
      .neq("status", "suspended")
      .order("updated_at", { ascending: false })
      .limit(1000),
  ]);

  if (jobsResult.error) console.error("[Sitemap] Could not load jobs:", jobsResult.error.message);
  if (profilesResult.error) console.error("[Sitemap] Could not load profiles:", profilesResult.error.message);

  const jobs = jobsResult.data;
  const profiles = profilesResult.data;

  const jobRoutes: SitemapEntry[] = (jobs || [])
    .filter((job) => job.id && job.title)
    .map((job) => ({
      url: absoluteUrl(`/jobs/${createJobShareToken({ id: job.id, title: job.title })}`),
      lastModified: safeDate(job.createdAt),
      changeFrequency: "daily",
      priority: 0.8,
    }));

  const profileRoutes: SitemapEntry[] = (profiles || [])
    .map((profile) => ({
      id: profile.id,
      slug: getProfileSlug(profile.username, profile.id),
      role: profile.role,
      lastModified: profile.updated_at,
    }))
    .filter((profile) => profile.slug && profile.role !== "admin")
    .map((profile) => ({
      url: absoluteUrl(`/${encodeURIComponent(profile.slug)}`),
      lastModified: safeDate(profile.lastModified),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...blogRoutes, ...jobRoutes, ...profileRoutes];
}
