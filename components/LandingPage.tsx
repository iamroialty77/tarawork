"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

type LandingBlogPost = Pick<BlogPost, "title" | "excerpt" | "href" | "image" | "imageAlt" | "category" | "readTime">;

const heroImage = "/landing/filipino-hero.png";
const collaborationImage = "/landing/filipino-collaboration.png";
const workspaceImage = "/landing/filipino-remote-work.png";

const categories = [
  "Virtual Assistants",
  "Web Developers",
  "Social Media Managers",
  "Graphic Designers",
  "Content Writers",
  "Customer Support",
];

export default function LandingPage() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactStatus, setContactStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });
  const [landingBlogPosts, setLandingBlogPosts] = useState<LandingBlogPost[]>([]);

  useEffect(() => {
    let mounted = true;

    fetch("/api/blog-posts", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!mounted || !Array.isArray(payload?.posts) || payload.posts.length === 0) return;
        setLandingBlogPosts(payload.posts.slice(0, 3));
      })
      .catch(() => {
        setLandingBlogPosts([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactStatus({ type: "error", message: "Please complete all fields before sending." });
      return;
    }

    setIsSendingContact(true);
    setContactStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to send message right now.");
      }

      setContactForm({ name: "", email: "", message: "" });
      setContactStatus({ type: "success", message: "Message sent successfully. We will get back to you soon." });
    } catch (error) {
      setContactStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to send message right now.",
      });
    } finally {
      setIsSendingContact(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-zinc-950">
      <SiteHeader overlay />

      <main>
        <section className="relative min-h-[760px] w-full overflow-hidden bg-zinc-950 sm:min-h-[92vh]">
          <Image
            src={heroImage}
            alt="Filipino professionals collaborating remotely"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-72"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.92),rgba(9,9,11,0.72),rgba(9,9,11,0.38))] sm:bg-[linear-gradient(90deg,rgba(9,9,11,0.94),rgba(9,9,11,0.7),rgba(9,9,11,0.18))]" />
          <div className="relative flex min-h-[760px] w-full items-center px-4 pb-10 pt-24 sm:min-h-[92vh] sm:px-6 sm:pb-12 sm:pt-28 lg:px-10">
            <div className="mx-auto w-full max-w-7xl">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-amber-100 backdrop-blur sm:px-4 sm:text-xs sm:tracking-[0.18em]">
                <Sparkles className="h-4 w-4" />
                <span className="leading-4">Philippine remote talent marketplace</span>
              </div>
              <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[1.04] text-white sm:mt-7 sm:text-6xl sm:leading-[0.98] lg:text-7xl">
                Hire Filipino freelancers with clarity from the first conversation.
              </h1>
              <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/82 sm:mt-7 sm:text-xl sm:leading-8">
                TaraWork helps employers find virtual assistants, developers, designers, writers, and support specialists through profiles that are easier to compare and easier to trust.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                <Link href="/hire/request" className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-300 px-6 py-4 text-base font-black text-zinc-950 transition hover:bg-amber-200">
                  Get Free Talent Shortlist
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/auth" className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/10 px-6 py-4 text-base font-black text-white backdrop-blur transition hover:bg-white/16">
                  Post a Job
                </Link>
              </div>
              <div className="mt-8 grid max-w-4xl overflow-hidden border border-white/16 bg-white/8 backdrop-blur sm:mt-12 md:grid-cols-3">
                {[
                  ["PH-first talent", "Focused on Filipino remote professionals and practical service categories."],
                  ["Cleaner shortlists", "Compare work style, services, portfolio details, and rates in one place."],
                  ["Faster decisions", "Start conversations with clearer context before interviews or trials."],
                ].map(([title, body]) => (
                  <div key={title} className="border-b border-white/14 p-4 last:border-b-0 sm:p-5 md:border-b-0 md:border-r md:last:border-r-0">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-200 sm:text-sm sm:tracking-[0.16em]">{title}</p>
                    <p className="mt-3 text-sm font-semibold leading-6 text-white/72">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full border-b border-zinc-200 bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
          <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[280px_1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">Popular categories</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-zinc-500">Browse common services requested by remote-first teams.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              {categories.map((category) => (
                <span key={category} className="flex min-h-12 items-center border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm font-black leading-5 text-zinc-800 shadow-sm sm:px-4">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full bg-teal-800 px-4 py-16 text-white sm:px-6 lg:px-10">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200">Concierge hiring</p>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
                Not ready to post a job? Get a shortlist first.
              </h2>
            </div>
            <div className="border border-white/16 bg-white/8 p-6">
              <p className="text-base font-semibold leading-8 text-white/82">
                Tell us the role, budget, hours, and skills you need. TaraWork can help turn that into a cleaner hiring brief and point you toward matching Filipino freelancers.
              </p>
              <Link href="/hire/request" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-4 text-sm font-black text-teal-900 transition hover:bg-amber-100 sm:w-auto">
                Request a Free Shortlist
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 w-full bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">Marketplace Workflow</p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-zinc-950 sm:text-5xl">
                Simple tools for better remote hiring.
              </h2>
              <p className="mt-5 text-lg font-medium leading-8 text-zinc-600">
                TaraWork keeps the hiring process focused: clear profiles, useful job details, and conversations that start with the right context.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:mt-14 lg:grid-cols-3">
              {[
                { icon: Users, title: "Find the right fit", body: "Compare skills, services, rates, and portfolio work before starting a conversation." },
                { icon: Briefcase, title: "Post clear work", body: "Describe the role, budget, schedule, and requirements so applicants know what matters." },
                { icon: ShieldCheck, title: "Hire with confidence", body: "Keep your shortlist organized and review each freelancer with practical details in one place." },
              ].map((item) => (
                <article key={item.title} className="border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-8">
                  <div className="flex h-12 w-12 items-center justify-center bg-teal-50 text-teal-800">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-black text-zinc-950 sm:mt-8">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-zinc-600">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid w-full bg-zinc-950 text-white lg:grid-cols-2">
          <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[520px]">
            <Image
              src={collaborationImage}
              alt="Filipino team reviewing remote hiring work"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex items-center px-4 py-14 sm:px-6 sm:py-16 lg:px-14">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Why it feels professional</p>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
                Profiles and jobs are built for comparison, not clutter.
              </h2>
              <div className="mt-8 space-y-5">
                {[
                  "Service packages, project examples, and profile sections help employers understand fit faster.",
                  "Organized hiring pages help both sides understand the work before committing time.",
                  "Freelancers get a stronger online presence than a basic resume or scattered portfolio link.",
                ].map((item) => (
                  <p key={item} className="flex gap-3 text-base font-semibold leading-7 text-white/80">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 w-full bg-zinc-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
          <div className="mx-auto grid w-full max-w-7xl gap-12 xl:grid-cols-[420px_1fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">How It Works</p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-zinc-950 sm:text-4xl">From job post to shortlist without the clutter.</h2>
              <p className="mt-5 text-base leading-8 text-zinc-600">
                Start with a clear role, review freelancer profiles, then move promising matches into conversations.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["1", "Post the role", "Add the work scope, skills, budget, schedule, and expectations."],
                ["2", "Review profiles", "Compare services, portfolio work, rates, and professional background."],
                ["3", "Start the conversation", "Message the best matches and move forward with clearer context."],
              ].map(([step, title, body]) => (
                <div key={step} className="border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
                  <p className="mb-6 flex h-11 w-11 items-center justify-center bg-zinc-950 text-sm font-black text-white sm:mb-8">{step}</p>
                  <h3 className="text-xl font-black text-zinc-950">{title}</h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-zinc-600">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid w-full bg-white lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
            <div className="max-w-4xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">Freelance Marketplace Philippines</p>
              <h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight text-zinc-950 sm:text-5xl">
                Built for business owners, agencies, and Filipino remote professionals.
              </h2>
              <div className="mt-8 max-w-4xl space-y-5 text-base font-medium leading-8 text-zinc-600">
                <p>
                  TaraWork.online is built for business owners, founders, agencies, and remote teams that need dependable online talent from the Philippines. Whether you need a virtual assistant, web developer, designer, writer, customer support specialist, marketing specialist, data entry professional, bookkeeper, project coordinator, or automation expert, TaraWork gives you a focused place to find people who understand remote work and professional client service.
                </p>
                <p>
                  Employers can post remote jobs, review freelancer profiles, compare skills, check portfolios, and start hiring conversations without wasting time on scattered messages. Each public profile can show practical details such as services offered, hourly rate, portfolio projects, work background, client feedback, contact preferences, and role category.
                </p>
                <p>
                  For freelancers and virtual assistants in the Philippines, TaraWork helps create a professional online presence that can be shared with clients. A freelancer profile is more than a basic resume. It can present skills, project examples, service packages, work style, achievements, and availability in a format designed for hiring decisions.
                </p>
              </div>
            </div>
          </div>
          <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[560px]">
            <Image
              src={workspaceImage}
              alt="Filipino virtual assistant working remotely"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        <section className="w-full border-y border-zinc-200 bg-zinc-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">TaraWork Blog</p>
                <h2 className="mt-4 text-3xl font-black leading-tight text-zinc-950 sm:text-5xl">
                  Professional guides for hiring and remote work.
                </h2>
                <p className="mt-5 text-base font-medium leading-8 text-zinc-600">
                  Organized articles for employers hiring Filipino freelancers and for Filipino professionals building stronger remote work profiles.
                </p>
              </div>
              <Link href="/blog" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-4 text-sm font-black text-white transition hover:bg-zinc-800 sm:w-auto">
                View All Guides
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {landingBlogPosts.length > 0 && (
              <div className="mt-10 grid gap-5 lg:grid-cols-3">
                {landingBlogPosts.map((post) => (
                  <article key={post.href} className="overflow-hidden border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative min-h-[220px]">
                      <Image src={post.image} alt={post.imageAlt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                    </div>
                    <div className="p-6">
                      <div className="flex h-11 w-11 items-center justify-center bg-teal-50 text-teal-800">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-teal-700">{post.category}</p>
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
            )}
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 w-full bg-teal-800 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200">Contact</p>
              <h2 className="mt-4 text-3xl font-black sm:text-5xl">Talk to TaraWork</h2>
              <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-white/78">
                Send a message about hiring, partnerships, freelancer onboarding, or product feedback. Keep your note specific so we can route it properly.
              </p>
              <div className="mt-8 flex items-center gap-3 text-sm font-black uppercase tracking-[0.16em] text-amber-200">
                <Star className="h-5 w-5" />
                Professional support for employers and talent
              </div>
            </div>

            <form className="bg-white p-5 text-zinc-950 shadow-2xl sm:p-7" onSubmit={handleContactSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={contactForm.name}
                    onChange={(event) => setContactForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full border border-zinc-300 px-4 py-3 text-zinc-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                    placeholder="Your name"
                    disabled={isSendingContact}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={contactForm.email}
                    onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full border border-zinc-300 px-4 py-3 text-zinc-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                    placeholder="you@email.com"
                    disabled={isSendingContact}
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="contact-message" className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={contactForm.message}
                  onChange={(event) => setContactForm((prev) => ({ ...prev, message: event.target.value }))}
                  className="min-h-40 w-full border border-zinc-300 px-4 py-3 text-zinc-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                  placeholder="Tell us how we can help."
                  disabled={isSendingContact}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSendingContact}
                className="mt-5 inline-flex w-full items-center justify-center bg-zinc-950 px-6 py-4 text-base font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Mail className="mr-2 h-5 w-5" />
                {isSendingContact ? "Sending..." : "Send Message"}
              </button>

              {contactStatus.type !== "idle" && (
                <p className={`mt-4 text-sm font-bold ${contactStatus.type === "success" ? "text-teal-700" : "text-rose-600"}`}>
                  {contactStatus.message}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
