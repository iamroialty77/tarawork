import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Clock, Facebook, Link2 } from "lucide-react";
import { absoluteUrl, siteName } from "@/lib/seo";
import { getPublishedBlogPostBySlug, getPublishedBlogPosts } from "@/lib/blogData";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return [];
}

const renderInlineContent = (text: string) => {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(<strong key={`${token}-${match.index}`} className="font-black text-zinc-900">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*") && token.endsWith("*")) {
      nodes.push(<em key={`${token}-${match.index}`} className="text-zinc-800">{token.slice(1, -1)}</em>);
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        nodes.push(
          <a
            key={`${token}-${match.index}`}
            href={linkMatch[2]}
            target={linkMatch[2].startsWith("http") ? "_blank" : undefined}
            rel={linkMatch[2].startsWith("http") ? "noreferrer" : undefined}
            className="font-black text-teal-800 underline decoration-teal-200 underline-offset-4 hover:text-teal-950"
          >
            {linkMatch[1]}
          </a>,
        );
      } else {
        nodes.push(token);
      }
    }

    cursor = match.index + token.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
};

const renderBodyBlocks = (body: string) =>
  body
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      if (line.startsWith("### ")) {
        return (
          <h3 key={`${line}-${index}`} className="mt-8 text-2xl font-black leading-tight text-zinc-950">
            {line.slice(4)}
          </h3>
        );
      }

      return (
        <p key={`${line}-${index}`} className="mt-5 text-lg font-medium leading-9 text-zinc-600">
          {renderInlineContent(line)}
        </p>
      );
    });

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [post.keyword, post.category, "TaraWork blog", "Filipino freelancers", "remote work Philippines"],
    alternates: { canonical: absoluteUrl(post.href) },
    openGraph: {
      type: "article",
      url: absoluteUrl(post.href),
      siteName,
      title: post.title,
      description: post.excerpt,
      locale: "en_PH",
      images: [{ url: post.image, width: 1200, height: 630, alt: post.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) notFound();

  const allPosts = await getPublishedBlogPosts();
  const sameCategoryPosts = allPosts
    .filter((item) => item.category === post.category && item.slug !== post.slug)
    .slice(0, 3);
  const relatedPosts =
    sameCategoryPosts.length > 0
      ? sameCategoryPosts
      : allPosts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const articleUrl = absoluteUrl(post.href);
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
  const publishedDate = post.publishedAt ? new Date(post.publishedAt) : null;

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link href="/" className="text-lg font-black text-teal-800">
            TaraWork.online
          </Link>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-black text-zinc-600 hover:text-zinc-950">
            <ArrowLeft className="h-4 w-4" />
            Blog
          </Link>
        </div>
      </header>

      <article>
        <section className="bg-zinc-950 text-white">
          <div className="mx-auto grid w-full max-w-7xl gap-0 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="flex items-center px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">{post.category}</p>
                <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">{post.title}</h1>
                <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/76">{post.excerpt}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 border border-white/14 bg-white/8 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/70">
                    <Clock className="h-4 w-4 text-amber-300" />
                    {post.readTime}
                  </span>
                  {publishedDate && (
                    <span className="inline-flex items-center gap-2 border border-white/14 bg-white/8 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/70">
                      <CalendarDays className="h-4 w-4 text-amber-300" />
                      {publishedDate.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="relative min-h-[360px] lg:min-h-[620px]">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.04),rgba(9,9,11,0.28))]" />
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[minmax(0,760px)_360px] lg:justify-between">
            <div>
              <div className="mb-10 border-l-4 border-teal-700 bg-zinc-50 p-6">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-700">Guide Summary</p>
                <p className="mt-3 text-lg font-medium leading-8 text-zinc-700">{post.excerpt}</p>
              </div>

              <div className="space-y-12">
                {post.content.map((section) => (
                  <section key={section.heading} className="border-b border-zinc-200 pb-12 last:border-b-0">
                    <h2 className="text-3xl font-black leading-tight text-zinc-950 sm:text-4xl">{section.heading}</h2>
                    {renderBodyBlocks(section.body)}
                  </section>
                ))}
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
                <BookOpen className="h-6 w-6 text-teal-700" />
                <h2 className="mt-4 text-xl font-black text-zinc-950">Next step</h2>
                <p className="mt-3 text-sm font-medium leading-7 text-zinc-600">
                  Use TaraWork to turn this guide into hiring action, profile improvement, or a cleaner shortlist.
                </p>
                <div className="mt-5 grid gap-3">
                  <Link href="/hire/request" className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-3 text-sm font-black text-white hover:bg-zinc-800">
                    Get a Shortlist
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href={post.sourceHref} className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-black text-zinc-700 hover:bg-zinc-100">
                    View related guide
                  </Link>
                </div>
              </div>

              <div className="mt-5 border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-black uppercase tracking-[0.18em] text-zinc-500">Share this article</h2>
                <div className="mt-4 grid gap-3">
                  <a
                    href={facebookShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1877F2] px-4 py-3 text-sm font-black text-white hover:bg-[#0f63cf]"
                  >
                    <Facebook className="h-4 w-4" />
                    Share on Facebook
                  </a>
                  <a
                    href={articleUrl}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-black text-zinc-700 hover:bg-zinc-100"
                  >
                    <Link2 className="h-4 w-4" />
                    Open article link
                  </a>
                </div>
              </div>

              {relatedPosts.length > 0 && (
                <div className="mt-5 border border-zinc-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-black uppercase tracking-[0.18em] text-zinc-500">Recommended Reads</h2>
                  <div className="mt-5 space-y-5">
                    {relatedPosts.map((item) => (
                      <Link key={item.href} href={item.href} className="grid grid-cols-[92px_1fr] gap-4 border-t border-zinc-100 pt-5 first:border-t-0 first:pt-0">
                        <div className="relative min-h-[74px] overflow-hidden bg-zinc-100">
                          <Image src={item.image} alt={item.imageAlt} fill sizes="92px" className="object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-black leading-6 text-zinc-950 hover:text-teal-800">{item.title}</p>
                          <p className="mt-1 text-xs font-semibold text-zinc-400">{item.readTime}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>
      </article>
    </main>
  );
}
