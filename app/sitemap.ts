import type { MetadataRoute } from "next";
import { createJobShareToken } from "@/lib/jobShare";
import { absoluteUrl } from "@/lib/seo";
import { supabaseAdmin } from "@/lib/supabase_admin";
import { getPublishedBlogPosts } from "@/lib/blogData";

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
      url: absoluteUrl("/blog"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/hire-filipino-freelancers"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/hire/request"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.96,
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
    {
      url: absoluteUrl("/hire-filipino-web-developer"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: absoluteUrl("/hire-filipino-social-media-manager"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: absoluteUrl("/virtual-assistant-rates-philippines"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.86,
    },
    {
      url: absoluteUrl("/top-remote-jobs-for-filipinos-2026"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.86,
    },
    {
      url: absoluteUrl("/how-to-hire-online-filipino-talent-safely"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.86,
    },
    {
      url: absoluteUrl("/flexible-remote-jobs-for-filipino-students"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.84,
    },
    {
      url: absoluteUrl("/best-freelance-niche-philippines"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.84,
    },
    {
      url: absoluteUrl("/work-from-home-2026"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.83,
    },
    {
      url: absoluteUrl("/project-base-work"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.82,
    },
  ];

  const publishedBlogPosts = await getPublishedBlogPosts();
  const blogRoutes: SitemapEntry[] = publishedBlogPosts.map((post) => ({
    url: absoluteUrl(post.href),
    lastModified: safeDate(post.modifiedAt || post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.78,
  }));

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

  return [...staticRoutes, ...blogRoutes, ...jobRoutes, ...profileRoutes];
}
