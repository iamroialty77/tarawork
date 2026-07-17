import { NextResponse } from "next/server";
import { getPublishedBlogPosts } from "@/lib/blogData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const posts = await getPublishedBlogPosts();

  return NextResponse.json(
    {
      posts: posts.slice(0, 6).map((post) => ({
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        href: post.href,
        image: post.image,
        imageAlt: post.imageAlt,
        category: post.category,
        readTime: post.readTime,
      })),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
