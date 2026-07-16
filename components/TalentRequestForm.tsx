"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Mail, ShieldCheck, Users } from "lucide-react";

const roleOptions = [
  "Virtual Assistant",
  "Customer Support",
  "Social Media Manager",
  "Web Developer",
  "Graphic Designer",
  "Content Writer",
  "Ecommerce Assistant",
  "Bookkeeper",
  "Data Entry Specialist",
  "Other",
];

const budgetOptions = [
  "Under $5/hour",
  "$5-$8/hour",
  "$8-$12/hour",
  "$12-$18/hour",
  "$18+/hour",
  "Project budget",
  "Not sure yet",
];

const startOptions = ["ASAP", "This week", "In 2-4 weeks", "Next month", "Still planning"];

type RequestStatus = {
  type: "idle" | "success" | "error";
  message: string;
};

export default function TalentRequestForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    roleNeeded: "Virtual Assistant",
    budget: "$5-$8/hour",
    hoursPerWeek: "",
    startDate: "ASAP",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<RequestStatus>({ type: "idle", message: "" });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.roleNeeded.trim() || !form.notes.trim()) {
      setStatus({ type: "error", message: "Please complete your name, email, role needed, and hiring notes." });
      return;
    }

    setLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/talent-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to send your request right now.");
      }

      setForm({
        name: "",
        email: "",
        company: "",
        roleNeeded: "Virtual Assistant",
        budget: "$5-$8/hour",
        hoursPerWeek: "",
        startDate: "ASAP",
        notes: "",
      });
      setStatus({
        type: "success",
        message: "Request received. We will review your hiring needs and send the next steps by email.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to send your request right now.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link href="/" className="text-lg font-black text-teal-800">
            TaraWork.online
          </Link>
          <Link href="/hire-filipino-freelancers" className="text-sm font-black text-zinc-600 hover:text-zinc-950">
            Hiring guide
          </Link>
        </div>
      </header>

      <section className="bg-zinc-950 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Free talent shortlist</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
              Tell us who you need. We will help shortlist Filipino talent.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/76">
              Skip the empty job board problem. Share the role, budget, and work scope, then TaraWork can help identify matching Filipino freelancers for your first shortlist.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Users, title: "Matched talent", body: "Relevant categories and profiles." },
                { icon: Clock, title: "Less friction", body: "No job post required first." },
                { icon: ShieldCheck, title: "Clear context", body: "Scope, budget, and availability." },
              ].map((item) => (
                <div key={item.title} className="border border-white/14 bg-white/8 p-4">
                  <item.icon className="h-5 w-5 text-amber-300" />
                  <p className="mt-4 text-sm font-black">{item.title}</p>
                  <p className="mt-2 text-xs font-semibold leading-5 text-white/64">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-5 text-zinc-950 shadow-2xl sm:p-7">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="request-name" className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                  Full Name
                </label>
                <input
                  id="request-name"
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="w-full border border-zinc-300 px-4 py-3 text-zinc-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                  placeholder="Your name"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label htmlFor="request-email" className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                  Work Email
                </label>
                <input
                  id="request-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="w-full border border-zinc-300 px-4 py-3 text-zinc-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                  placeholder="you@company.com"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="request-company" className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                Company or Website
              </label>
              <input
                id="request-company"
                type="text"
                value={form.company}
                onChange={(event) => updateField("company", event.target.value)}
                className="w-full border border-zinc-300 px-4 py-3 text-zinc-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                placeholder="Company name or website"
                disabled={loading}
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="request-role" className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                  Role Needed
                </label>
                <select
                  id="request-role"
                  value={form.roleNeeded}
                  onChange={(event) => updateField("roleNeeded", event.target.value)}
                  className="w-full border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                  disabled={loading}
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="request-budget" className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                  Budget
                </label>
                <select
                  id="request-budget"
                  value={form.budget}
                  onChange={(event) => updateField("budget", event.target.value)}
                  className="w-full border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                  disabled={loading}
                >
                  {budgetOptions.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="request-hours" className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                  Hours Per Week
                </label>
                <input
                  id="request-hours"
                  type="text"
                  value={form.hoursPerWeek}
                  onChange={(event) => updateField("hoursPerWeek", event.target.value)}
                  className="w-full border border-zinc-300 px-4 py-3 text-zinc-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                  placeholder="Example: 20 hours"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="request-start" className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                  Start Date
                </label>
                <select
                  id="request-start"
                  value={form.startDate}
                  onChange={(event) => updateField("startDate", event.target.value)}
                  className="w-full border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                  disabled={loading}
                >
                  {startOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="request-notes" className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                Hiring Notes
              </label>
              <textarea
                id="request-notes"
                value={form.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                className="min-h-36 w-full border border-zinc-300 px-4 py-3 text-zinc-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                placeholder="Tell us the tasks, tools, skills, schedule, and type of freelancer you need."
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-zinc-950 px-6 py-4 text-base font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending request..." : "Get Free Talent Shortlist"}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>

            {status.type !== "idle" && (
              <p className={`mt-4 flex gap-2 text-sm font-bold ${status.type === "success" ? "text-teal-700" : "text-rose-600"}`}>
                {status.type === "success" && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
                {status.message}
              </p>
            )}

            <p className="mt-5 flex items-center gap-2 text-xs font-semibold leading-5 text-zinc-500">
              <Mail className="h-4 w-4 shrink-0" />
              We use your details only to respond to this hiring request.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
