"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Mail,
  Menu,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";

const heroImage = "/landing/filipino-hero.png";
const collaborationImage = "/landing/filipino-collaboration.png";
const workspaceImage = "/landing/filipino-remote-work.png";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Hire Freelancers", href: "/hire-filipino-freelancers" },
  { label: "Virtual Assistants", href: "/virtual-assistant-philippines" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Contact", href: "#contact" },
];

const categories = [
  "Virtual Assistants",
  "Web Developers",
  "Social Media Managers",
  "Graphic Designers",
  "Content Writers",
  "Customer Support",
];

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
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-zinc-950">
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all ${
          scrolled ? "border-white/20 bg-zinc-950/88 shadow-lg backdrop-blur-md" : "border-white/15 bg-zinc-950/50 backdrop-blur-sm"
        }`}
      >
        <div className="flex w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white">
              <img src="/tarawork-removebg-preview.png" alt="TaraWork" className="h-8 w-8 object-contain" />
            </span>
            <span className="text-lg font-black text-white">TaraWork.online</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <a key={link.href} href={link.href} className="text-sm font-bold text-white/78 transition hover:text-white">
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href} className="text-sm font-bold text-white/78 transition hover:text-white">
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link href="/auth" className="rounded-lg border border-white/25 px-4 py-2 text-sm font-black text-white transition hover:bg-white/10">
              Sign In
            </Link>
            <Link href="/auth" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-amber-100">
              Join Now
            </Link>
          </div>

          <button
            className="rounded-lg border border-white/20 p-2 text-white md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-white/15 bg-zinc-950 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) =>
                link.href.startsWith("#") ? (
                  <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-bold text-white/80 hover:bg-white/10">
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-bold text-white/80 hover:bg-white/10">
                    {link.label}
                  </Link>
                ),
              )}
              <Link href="/auth" className="mt-2 rounded-lg bg-white px-3 py-2 text-center text-sm font-black text-zinc-950">
                Join Now
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="relative min-h-[92vh] w-full overflow-hidden bg-zinc-950">
          <Image
            src={heroImage}
            alt="Filipino professionals collaborating remotely"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-72"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.92),rgba(9,9,11,0.68),rgba(9,9,11,0.2))]" />
          <div className="relative flex min-h-[92vh] w-full items-center px-4 pb-16 pt-28 sm:px-6 lg:px-10">
            <div className="w-full max-w-6xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-amber-100 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Philippine remote talent marketplace
              </div>
              <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.96] text-white sm:text-6xl lg:text-8xl">
                Hire Filipino freelancers with proof, context, and speed.
              </h1>
              <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-white/82 sm:text-xl">
                TaraWork helps employers discover Filipino virtual assistants, developers, designers, writers, and support specialists through structured profiles, public job pages, and focused hiring workflows.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/auth" className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-300 px-6 py-4 text-base font-black text-zinc-950 transition hover:bg-amber-200">
                  Post a Job
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/auth" className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/10 px-6 py-4 text-base font-black text-white backdrop-blur transition hover:bg-white/16">
                  Join as a Freelancer
                </Link>
              </div>
              <div className="mt-10 grid max-w-3xl grid-cols-3 border-y border-white/18 py-5">
                {[
                  ["PH-first", "Talent focus"],
                  ["Fast", "Shortlisting"],
                  ["Clear", "Profiles"],
                ].map(([value, label]) => (
                  <div key={label} className="border-r border-white/18 px-4 first:pl-0 last:border-r-0">
                    <p className="text-2xl font-black text-white sm:text-3xl">{value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/60">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-amber-300 px-4 py-5 sm:px-6 lg:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-zinc-950">Popular hiring categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span key={category} className="rounded-full border border-zinc-950/15 bg-white/55 px-4 py-2 text-sm font-black text-zinc-950">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-white px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">Marketplace Workflow</p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">
                Simple tools for better remote hiring.
              </h2>
              <p className="mt-5 text-lg font-medium leading-8 text-zinc-600">
                TaraWork keeps the hiring process focused: clear profiles, useful job details, and conversations that start with the right context.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {[
                { icon: Users, title: "Find the right fit", body: "Compare skills, services, rates, and portfolio work before starting a conversation." },
                { icon: Briefcase, title: "Post clear work", body: "Describe the role, budget, schedule, and requirements so applicants know what matters." },
                { icon: ShieldCheck, title: "Hire with confidence", body: "Keep your shortlist organized and review each freelancer with practical details in one place." },
              ].map((item) => (
                <article key={item.title} className="border border-zinc-200 bg-white p-7 shadow-sm">
                  <item.icon className="h-9 w-9 text-teal-700" />
                  <h3 className="mt-6 text-2xl font-black text-zinc-950">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-zinc-600">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid w-full bg-zinc-950 text-white lg:grid-cols-2">
          <div className="relative min-h-[520px]">
            <Image
              src={collaborationImage}
              alt="Filipino team reviewing remote hiring work"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex items-center px-4 py-16 sm:px-6 lg:px-14">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Why it feels professional</p>
              <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
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

        <section id="how-it-works" className="w-full bg-zinc-50 px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto grid w-full max-w-7xl gap-10 xl:grid-cols-[390px_1fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">How It Works</p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-zinc-950">From job post to shortlist without the clutter.</h2>
              <p className="mt-5 text-base leading-8 text-zinc-600">
                Start with a clear role, review freelancer profiles, then move promising matches into conversations.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {[
                ["1", "Post the role", "Add the work scope, skills, budget, schedule, and expectations."],
                ["2", "Review profiles", "Compare services, portfolio work, rates, and professional background."],
                ["3", "Start the conversation", "Message the best matches and move forward with clearer context."],
              ].map(([step, title, body]) => (
                <div key={step} className="bg-white p-6 shadow-sm ring-1 ring-zinc-200">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="mb-5 flex h-10 w-10 items-center justify-center bg-teal-700 text-sm font-black text-white">{step}</p>
                      <h3 className="text-xl font-black text-zinc-950">{title}</h3>
                      <p className="mt-3 text-sm font-medium leading-6 text-zinc-600">{body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid w-full bg-white lg:grid-cols-[1.05fr_0.95fr]">
          <div className="px-4 py-20 sm:px-6 lg:px-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">Freelance Marketplace Philippines</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">
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
          <div className="relative min-h-[560px]">
            <Image
              src={workspaceImage}
              alt="Filipino virtual assistant working remotely"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        <section id="contact" className="w-full bg-teal-800 px-4 py-20 text-white sm:px-6 lg:px-10">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200">Contact</p>
              <h2 className="mt-4 text-4xl font-black sm:text-5xl">Talk to TaraWork</h2>
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

      <footer className="w-full border-t border-zinc-200 bg-white px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex w-full flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="text-sm font-bold text-zinc-500">(c) 2026 TaraWork.online. All rights reserved.</p>
          <div className="flex items-center gap-5 text-sm font-bold text-zinc-500">
            <a href="#" className="hover:text-zinc-950">Privacy</a>
            <a href="#" className="hover:text-zinc-950">Terms</a>
            <a href="#" className="hover:text-zinc-950">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
