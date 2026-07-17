import { unstable_noStore as noStore } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase_admin";
import type { BlogCategory, BlogPost } from "@/lib/blog";

type DbBlogPost = {
  title: string;
  excerpt: string;
  slug: string;
  category: BlogCategory;
  read_time?: string | null;
  keyword?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
  content?: unknown;
  published_at?: string | null;
};

const isContentSection = (value: unknown): value is { heading: string; body: string } => {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.heading === "string" && typeof item.body === "string";
};

const mapDbPost = (post: DbBlogPost): BlogPost => {
  const content = Array.isArray(post.content) ? post.content.filter(isContentSection) : [];

  return {
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    href: `/blog/${post.slug}`,
    sourceHref: `/blog/${post.slug}`,
    image: post.image_url || "/landing/filipino-hero.png",
    imageAlt: post.image_alt || post.title,
    category: post.category,
    readTime: post.read_time || "5 min read",
    keyword: post.keyword || post.title,
    publishedAt: post.published_at || undefined,
    content:
      content.length > 0
        ? content
        : [
            {
              heading: post.title,
              body: post.excerpt,
            },
          ],
  };
};

export async function getPublishedBlogPosts() {
  noStore();

  try {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("title,excerpt,slug,category,read_time,keyword,image_url,image_alt,content,published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error || !data?.length) return [];

    return (data as DbBlogPost[]).map(mapDbPost);
  } catch {
    return [];
  }
}

export async function getPublishedBlogPostBySlug(slug: string) {
  noStore();

  try {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("title,excerpt,slug,category,read_time,keyword,image_url,image_alt,content,published_at")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!error && data) return mapDbPost(data as DbBlogPost);
  } catch {
    // Return null so public blog pages only use database posts.
  }

  return null;
}
