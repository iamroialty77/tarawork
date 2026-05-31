"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Mail, Menu, X, Sparkles, CheckCircle2, Users, Briefcase, ShieldCheck } from "lucide-react";

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
          scrolled ? "border-slate-200 bg-white/95 backdrop-blur" : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-blue-700">TaraWork.online</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Features
            </a>
            <a href="#plans" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Plans
            </a>
            <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Contact
            </a>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link href="/auth" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100">
              Sign In
            </Link>
            <Link href="/auth" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
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
              <a href="#plans" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Plans
              </a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Contact
              </a>
              <Link href="/auth" className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-bold text-slate-700">
                Sign In
              </Link>
              <Link href="/auth" className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-bold text-white">
                Join Now
              </Link>
            </div>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">Tara, Work Together</h1>
            <p className="mt-4 text-lg font-semibold text-white/90 sm:text-2xl">Need an extra hand? You are in the right place.</p>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/85 lg:mx-0">
              TaraWork.online connects businesses with skilled freelancers and virtual assistants across the Philippines.
              Hire faster, collaborate better, and move projects forward with confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/auth" className="rounded-xl bg-white px-6 py-3 text-center text-base font-black text-blue-700 hover:bg-slate-100">
                Join as a Freelancer
              </Link>
              <Link href="/auth" className="rounded-xl border border-white/40 px-6 py-3 text-center text-base font-black text-white hover:bg-white/10">
                Post a Job
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/30 bg-white/95 p-6 text-slate-900 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900">Why teams choose TaraWork</h3>
            <div className="mt-5 space-y-3">
              {[
                "AI-assisted candidate matching",
                "Verified freelancer profiles",
                "Fast hiring workflow",
                "Clear collaboration tools",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="text-sm font-semibold text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-16 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">Built for modern hiring</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              A cleaner way to connect freelancers and employers without complicated setup.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <Users className="h-8 w-8 text-blue-600" />
              <h3 className="mt-4 text-xl font-bold text-slate-900">Trusted Talent</h3>
              <p className="mt-2 text-sm text-slate-600">Discover qualified freelancers with clear skills and portfolio context.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <Briefcase className="h-8 w-8 text-teal-600" />
              <h3 className="mt-4 text-xl font-bold text-slate-900">Faster Hiring</h3>
              <p className="mt-2 text-sm text-slate-600">Post jobs quickly, review matches, and start collaboration in less time.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <ShieldCheck className="h-8 w-8 text-indigo-600" />
              <h3 className="mt-4 text-xl font-bold text-slate-900">Professional Workflow</h3>
              <p className="mt-2 text-sm text-slate-600">Keep communication and project details organized in one platform.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="px-4 py-16 sm:px-6">
        <div className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">Contact Us</h2>
            <p className="mt-2 text-slate-600">Send us a message and we will respond as soon as possible.</p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleContactSubmit}>
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
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
