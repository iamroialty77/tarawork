import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { absoluteUrl, siteName } from "@/lib/seo";
import { blogPosts } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

const getPost = (slug: string) => blogPosts.find((post) => post.slug === slug);

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

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
  const post = getPost(slug);

  if (!post) notFound();

  const relatedPosts = blogPosts
    .filter((item) => item.category === post.category && item.slug !== post.slug)
    .slice(0, 2);

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
        <section className="bg-zinc-950 px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-10">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">{post.category}</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">{post.title}</h1>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/76">{post.excerpt}</p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/64">
                <span>{post.readTime}</span>
                <span>{post.keyword}</span>
              </div>
            </div>
            <div className="relative min-h-[320px] overflow-hidden border border-white/14 sm:min-h-[420px]">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-10">
              {post.content.map((section) => (
                <section key={section.heading} className="border-b border-zinc-200 pb-10 last:border-b-0">
                  <h2 className="text-3xl font-black leading-tight text-zinc-950">{section.heading}</h2>
                  <p className="mt-5 text-lg font-medium leading-9 text-zinc-600">{section.body}</p>
                </section>
              ))}
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="border border-zinc-200 bg-zinc-50 p-6">
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
                    View SEO Guide
                  </Link>
                </div>
              </div>

              {relatedPosts.length > 0 && (
                <div className="mt-5 border border-zinc-200 bg-white p-6">
                  <h2 className="text-sm font-black uppercase tracking-[0.18em] text-zinc-500">Related</h2>
                  <div className="mt-4 space-y-4">
                    {relatedPosts.map((item) => (
                      <Link key={item.href} href={item.href} className="block border-t border-zinc-100 pt-4 first:border-t-0 first:pt-0">
                        <p className="text-sm font-black leading-6 text-zinc-950 hover:text-teal-800">{item.title}</p>
                        <p className="mt-1 text-xs font-semibold text-zinc-400">{item.readTime}</p>
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
