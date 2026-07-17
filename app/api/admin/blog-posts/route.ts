import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin, getClientIp, rateLimit } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabase_admin";
import { blogCategories, type BlogCategory } from "@/lib/blog";

export const runtime = "nodejs";

type BlogPostBody = {
  title?: string;
  excerpt?: string;
  category?: string;
  imageUrl?: string;
  imageAlt?: string;
  keyword?: string;
  readTime?: string;
  publishedAt?: string;
  status?: string;
  content?: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

const cleanLine = (value: unknown, maxLength = 220) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

const contentToSections = (content: string) => {
  const blocks = content
    .split(/\n\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const [firstLine, ...rest] = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const hasHeading = firstLine && rest.length > 0 && firstLine.length <= 90;

    return {
      heading: hasHeading ? firstLine : `Guide section ${index + 1}`,
      body: hasHeading ? rest.join(" ") : block.replace(/\s+/g, " "),
    };
  });
};

export async function GET(req: NextRequest) {
  const admin = await requireAdminUser();
  if (admin.error) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const limited = rateLimit({
    key: `admin:blog-posts:list:${admin.user?.id || getClientIp(req)}`,
    limit: 60,
    windowMs: 60 * 1000,
  });
  if (limited) return limited;

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("id,title,slug,category,status,published_at,image_url,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ posts: data || [] });
}

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;

  const admin = await requireAdminUser();
  if (admin.error) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const limited = rateLimit({
    key: `admin:blog-posts:create:${admin.user?.id || getClientIp(req)}`,
    limit: 20,
    windowMs: 60 * 60 * 1000,
  });
  if (limited) return limited;

  try {
    const body = (await req.json()) as BlogPostBody;
    const title = cleanLine(body.title, 140);
    const excerpt = cleanLine(body.excerpt, 280);
    const category = cleanLine(body.category, 80) as BlogCategory;
    const imageUrl = cleanLine(body.imageUrl, 500);
    const imageAlt = cleanLine(body.imageAlt, 180) || title;
    const keyword = cleanLine(body.keyword, 120) || title;
    const readTime = cleanLine(body.readTime, 30) || "5 min read";
    const status = body.status === "draft" ? "draft" : "published";
    const content = String(body.content || "").trim().slice(0, 12000);
    const publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();

    if (!title || !excerpt || !content) {
      return NextResponse.json({ error: "Title, excerpt, and content are required." }, { status: 400 });
    }

    if (!blogCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid blog category." }, { status: 400 });
    }

    if (Number.isNaN(publishedAt.getTime())) {
      return NextResponse.json({ error: "Invalid publish date." }, { status: 400 });
    }

    const baseSlug = slugify(title);
    const slug = baseSlug || `blog-${Date.now()}`;
    const sections = contentToSections(content);

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .insert([
        {
          title,
          slug,
          excerpt,
          category,
          image_url: imageUrl || "/landing/filipino-hero.png",
          image_alt: imageAlt,
          keyword,
          read_time: readTime,
          content: sections,
          status,
          published_at: publishedAt.toISOString(),
          author_id: admin.user?.id || null,
        },
      ])
      .select("id,title,slug,status,published_at")
      .single();

    if (error) {
      const isDuplicate = error.message.toLowerCase().includes("duplicate");
      return NextResponse.json(
        { error: isDuplicate ? "A post with this title or slug already exists." : error.message },
        { status: isDuplicate ? 409 : 500 },
      );
    }

    return NextResponse.json({ success: true, post: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create blog post.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
