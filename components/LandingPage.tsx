"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Briefcase,
  Mail,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <header
        className={`sticky top-0 z-50 border-b transition-all ${
          scrolled ? "border-slate-200 bg-white/95 shadow-sm backdrop-blur" : "border-slate-200 bg-white"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-950">TaraWork.online</span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Features
            </a>
            <Link href="/hire-filipino-freelancers" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Hire Freelancers
            </Link>
            <Link href="/virtual-assistant-philippines" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Virtual Assistants
            </Link>
            <a href="#guides" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Guides
            </a>
            <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Contact
            </a>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link href="/auth" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100">
              Sign In
            </Link>
            <Link href="/auth" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
              Join Now
            </Link>
          </div>

          <button
            className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
            <div className="flex flex-col gap-2">
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Features
              </a>
              <Link href="/hire-filipino-freelancers" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Hire Freelancers
              </Link>
              <Link href="/virtual-assistant-philippines" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Virtual Assistants
              </Link>
              <Link href="/remote-jobs-philippines" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Remote Jobs
              </Link>
              <a href="#guides" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Guides
              </a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Contact
              </a>
              <Link href="/auth" className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-bold text-slate-700">
                Sign In
              </Link>
              <Link href="/auth" className="rounded-lg bg-slate-950 px-3 py-2 text-center text-sm font-bold text-white">
                Join Now
              </Link>
            </div>
          </div>
        )}
      </header>

      <section className="border-b border-slate-200 bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              Tara, Work Together
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Hire Filipino freelancers and virtual assistants
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              TaraWork.online connects businesses with skilled remote talent across the Philippines. Post roles, compare public profiles, review portfolios, and start hiring conversations in one professional marketplace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth" className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-3 text-base font-black text-white hover:bg-slate-800">
                Post a Job
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/auth" className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3 text-base font-black text-slate-800 hover:bg-slate-50">
                Join as a Freelancer
              </Link>
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 py-4">
              <div className="pr-4">
                <p className="text-2xl font-black text-slate-950">6+</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Service guides</p>
              </div>
              <div className="px-4">
                <p className="text-2xl font-black text-slate-950">24/7</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Remote access</p>
              </div>
              <div className="pl-4">
                <p className="text-2xl font-black text-slate-950">PH</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Talent focus</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 shadow-2xl">
            <div className="rounded-xl bg-white p-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Talent Search</p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">Shortlist remote talent</h2>
                </div>
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["Virtual Assistant", "Admin, inbox, scheduling", "92%"],
                  ["Web Developer", "React, Next.js, ecommerce", "88%"],
                  ["Social Media Manager", "Content, captions, reporting", "84%"],
                ].map(([role, detail, score]) => (
                  <div key={role} className="grid grid-cols-[1fr_auto] gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div>
                      <p className="text-sm font-black text-slate-900">{role}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{detail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-600">{score}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Match</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
                <p className="flex items-start gap-3 text-sm font-bold leading-6 text-blue-950">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                  Public job and profile pages are built to be discoverable while private account areas stay blocked from search.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-16 sm:px-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">Marketplace Workflow</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Built for modern remote hiring</h2>
            </div>
            <p className="text-base leading-8 text-slate-600">
              TaraWork gives employers and freelancers a more structured way to present work, evaluate fit, and move from discovery to collaboration without scattered messages or incomplete profiles.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: Users, title: "Structured Profiles", body: "Review services, skills, portfolio work, rates, and work style before starting a conversation." },
              { icon: Briefcase, title: "Public Job Pages", body: "Share live opportunities that search engines can discover while applicants see the full role context." },
              { icon: ShieldCheck, title: "Private Areas Protected", body: "Admin, API, dashboard, message, webhook, and auth routes stay out of Google search results." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <item.icon className="h-8 w-8 text-blue-600" />
                <h3 className="mt-4 text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="guides" className="border-y border-slate-200 bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[360px_1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">Hiring Guides</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Focused pages for high-intent searches</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              These guides support search visibility while helping employers understand what to hire, how to scope the work, and what to expect from remote Filipino talent.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["/hire-filipino-freelancers", "Hire Filipino Freelancers", "Design, development, writing, admin, support, ecommerce, and operations."],
              ["/virtual-assistant-philippines", "Virtual Assistant Philippines", "Inbox management, scheduling, customer support, research, and admin work."],
              ["/remote-jobs-philippines", "Remote Jobs Philippines", "Remote opportunities and public profiles for Filipino online professionals."],
              ["/hire-filipino-web-developer", "Hire Filipino Web Developers", "Websites, dashboards, ecommerce, React, Next.js, WordPress, and APIs."],
              ["/hire-filipino-social-media-manager", "Hire Social Media Managers", "Captions, calendars, publishing, community replies, and reporting."],
              ["/virtual-assistant-rates-philippines", "VA Rates Philippines", "Pricing factors, task scope, experience, hours, and hiring expectations."],
            ].map(([href, title, body]) => (
              <Link key={href} href={href} className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-950">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">Freelance Marketplace Philippines</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Hire Filipino freelancers and virtual assistants with confidence
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              TaraWork.online is built for business owners, founders, agencies, and remote teams that need dependable online talent from the Philippines. Whether you need a virtual assistant, web developer, designer, writer, customer support specialist, marketing specialist, data entry professional, bookkeeper, project coordinator, or automation expert, TaraWork gives you a focused place to find people who understand remote work and professional client service.
            </p>
          </div>

          <div className="columns-1 gap-8 space-y-5 text-sm leading-7 text-slate-700 lg:columns-2">
            <p>
              Employers can post remote jobs, review freelancer profiles, compare skills, check portfolios, and start hiring conversations without wasting time on scattered messages. Each public profile can show practical details such as services offered, hourly rate, portfolio projects, work background, client feedback, contact preferences, and role category. This helps companies evaluate talent based on real work context instead of short, incomplete profiles.
            </p>
            <p>
              For freelancers and virtual assistants in the Philippines, TaraWork helps create a professional online presence that can be shared with clients. A freelancer profile is more than a basic resume. It can present skills, project examples, service packages, work style, achievements, and availability in a format designed for hiring decisions. This is useful for Filipino freelancers who want to attract remote clients, build trust, and compete for quality online work.
            </p>
            <p>
              TaraWork focuses on the work categories that businesses search for most: virtual assistance, administrative support, social media management, content writing, graphic design, web development, ecommerce support, customer service, lead generation, data management, finance support, and project operations. The platform is structured so search engines can understand the marketplace, public job pages, and public freelancer pages while private account areas, admin tools, APIs, dashboards, and messages stay out of search results.
            </p>
            <p>
              If you are searching for a Filipino virtual assistant, a remote freelancer in the Philippines, or a reliable online worker for a growing business, TaraWork is designed to make discovery and hiring cleaner. If you are a freelancer, TaraWork helps you publish a credible profile that can rank for your name, skill category, services, and portfolio work. The goal is a marketplace where clients find the right talent faster and professionals have a better chance to be discovered by serious employers.
            </p>
            <p>
              Many teams hire from the Philippines because Filipino professionals are known for strong English communication, adaptability, client support experience, and familiarity with global remote work tools. TaraWork supports that hiring journey by giving employers public job pages that can be shared, indexed, and discovered by applicants who are actively looking for remote work. Job seekers can understand the role, expected skills, compensation details, duration, and application path before they commit time to applying.
            </p>
            <p>
              Good SEO for a freelance platform depends on clean public pages, meaningful page titles, accurate descriptions, structured internal links, and crawl rules that keep private software areas away from search engines. TaraWork now separates the public marketplace, job opportunities, and profile pages from account-only areas such as dashboards, admin screens, authentication, API routes, messages, webhooks, and integrations. This helps search engines focus crawl budget on pages that should appear in search results: the homepage, live job posts, company profiles, and freelancer portfolios.
            </p>
            <p>
              TaraWork is not only for one-time hiring. It can support long-term remote staffing, project-based freelance work, part-time virtual assistant roles, specialist services, and growing agency teams. Clients can use it to find help for daily operations, content production, sales support, website updates, design tasks, customer communication, reporting, and administrative work. Freelancers can use it to describe their niche clearly, show relevant proof, and make it easier for employers to decide whether they are a strong fit.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">Contact</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Talk to TaraWork</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Send a message about hiring, partnerships, freelancer onboarding, or product feedback. Keep your note specific so we can route it properly.
            </p>
          </div>

          <form className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6" onSubmit={handleContactSubmit}>
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Full Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={contactForm.name}
                onChange={(event) => setContactForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
                disabled={isSendingContact}
                required
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                value={contactForm.email}
                onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@email.com"
                disabled={isSendingContact}
                required
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Message
              </label>
              <textarea
                id="contact-message"
                value={contactForm.message}
                onChange={(event) => setContactForm((prev) => ({ ...prev, message: event.target.value }))}
                className="min-h-36 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us how we can help."
                disabled={isSendingContact}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSendingContact}
              className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-6 py-3 font-bold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Mail className="mr-2 h-4 w-4" />
              {isSendingContact ? "Sending..." : "Send Message"}
            </button>

            {contactStatus.type !== "idle" && (
              <p className={`text-sm font-semibold ${contactStatus.type === "success" ? "text-emerald-600" : "text-rose-600"}`}>
                {contactStatus.message}
              </p>
            )}
          </form>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="text-sm font-semibold text-slate-500">© 2026 TaraWork.online. All rights reserved.</p>
          <div className="flex items-center gap-5 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-slate-800">Privacy</a>
            <a href="#" className="hover:text-slate-800">Terms</a>
            <a href="#" className="hover:text-slate-800">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
