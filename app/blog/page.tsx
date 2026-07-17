import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, Search, Users } from "lucide-react";
import { absoluteUrl, defaultOgImage, siteName } from "@/lib/seo";
import { blogCategories } from "@/lib/blog";
import { getPublishedBlogPosts } from "@/lib/blogData";

const title = "TaraWork Blog";
const description =
  "Professional guides about remote jobs for Filipinos, hiring Filipino freelancers, virtual assistants in the Philippines, and freelance career growth.";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "TaraWork Blog | Remote Jobs, Filipino Freelancers, and Hiring Guides",
  description,
  keywords: [
    "TaraWork blog",
    "remote jobs for Filipinos blog",
    "hire Filipino freelancers guide",
    "virtual assistant Philippines guide",
    "freelance jobs Philippines tips",
    "Filipino freelancer career tips",
  ],
  alternates: { canonical: absoluteUrl("/blog") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/blog"),
    siteName,
    title,
    description,
    locale: "en_PH",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultOgImage.url],
  },
};

const categoryIcons = {
  "Employer Hiring Guides": Briefcase,
  "Remote Jobs for Filipinos": Search,
  "Virtual Assistant Guides": Users,
  "Freelancer Career Tips": BookOpen,
};

export default async function BlogPage() {
  const blogPosts = await getPublishedBlogPosts();

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link href="/" className="text-lg font-black text-teal-800">
            TaraWork.online
          </Link>
          <Link href="/hire/request" className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-black text-white hover:bg-zinc-800">
            Get Shortlist
          </Link>
        </div>
      </header>

      <section className="bg-zinc-950 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">TaraWork Blog</p>
          <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight sm:text-6xl">
            Remote work, hiring, and freelance guides for the Philippine talent market.
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-white/76">
            Organized resources for employers hiring Filipino freelancers and for Filipino professionals building stronger remote work profiles.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-4 md:grid-cols-4">
            {blogCategories.map((category) => {
              const Icon = categoryIcons[category];
              const count = blogPosts.filter((post) => post.category === category).length;
              return (
                <a key={category} href={`#${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <Icon className="h-6 w-6 text-teal-700" />
                  <p className="mt-4 text-sm font-black text-zinc-950">{category}</p>
                  <p className="mt-2 text-xs font-semibold text-zinc-500">{count} guides</p>
                </a>
              );
            })}
          </div>

          <div className="mt-14 space-y-14">
            {blogCategories.map((category) => (
              <section key={category} id={category.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="scroll-mt-24">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">Category</p>
                    <h2 className="mt-2 text-3xl font-black text-zinc-950">{category}</h2>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {blogPosts
                    .filter((post) => post.category === category)
                    .map((post) => (
                      <article key={post.href} className="overflow-hidden border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                        <div className="relative min-h-[220px]">
                          <Image src={post.image} alt={post.imageAlt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                        </div>
                        <div className="p-6">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-700">{post.keyword}</p>
                          <h3 className="mt-3 text-2xl font-black leading-tight text-zinc-950">{post.title}</h3>
                          <p className="mt-3 text-sm font-medium leading-7 text-zinc-600">{post.excerpt}</p>
                          <div className="mt-6 flex items-center justify-between gap-4">
                            <span className="text-xs font-bold text-zinc-400">{post.readTime}</span>
                            <Link href={post.href} className="inline-flex items-center gap-2 text-sm font-black text-teal-800 hover:text-teal-950">
                              Read More
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
