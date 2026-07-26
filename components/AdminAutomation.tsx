"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  RefreshCw,
  Sparkles,
  UserRoundCheck,
  Users,
  FileSpreadsheet,
} from "lucide-react";
import JobMatchAutomation from "./JobMatchAutomation";
import ProfileReminderAutomation from "./ProfileReminderAutomation";
import CsvEmailAutomation from "./CsvEmailAutomation";

type BotId = "profile-reminder" | "job-match" | "csv-email";
type BotSummary = {
  enabled: boolean;
  recipientCount: number;
  loading: boolean;
  error?: string;
};

const emptySummary: BotSummary = { enabled: false, recipientCount: 0, loading: true };

export default function AdminAutomation() {
  const [activeBot, setActiveBot] = useState<BotId | null>(null);
  const [summaries, setSummaries] = useState<Record<BotId, BotSummary>>({
    "profile-reminder": emptySummary,
    "job-match": emptySummary,
    "csv-email": { enabled: true, recipientCount: 0, loading: false },
  });

  const loadSummaries = async () => {
    setSummaries((current) => ({
      "profile-reminder": { ...current["profile-reminder"], loading: true, error: undefined },
      "job-match": { ...current["job-match"], loading: true, error: undefined },
      "csv-email": current["csv-email"],
    }));

    const requests: Array<[BotId, string]> = [
      ["profile-reminder", "/api/admin/profile-reminder-automation"],
      ["job-match", "/api/admin/job-match-automation"],
      ["csv-email", "/api/admin/csv-email-automation"],
    ];

    const results = await Promise.all(
      requests.map(async ([id, url]) => {
        try {
          const response = await fetch(url, { cache: "no-store" });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Unable to load bot.");
          return [id, { enabled: Boolean(data.config?.enabled), recipientCount: Number(data.recipientCount || data.recipients?.length || 0), loading: false }] as const;
        } catch (error) {
          return [id, { enabled: false, recipientCount: 0, loading: false, error: error instanceof Error ? error.message : "Unable to load bot." }] as const;
        }
      }),
    );

    setSummaries(Object.fromEntries(results) as Record<BotId, BotSummary>);
  };

  useEffect(() => {
    void loadSummaries();
  }, []);

  const bots = [
    {
      id: "profile-reminder" as const,
      name: "Profile Reminder",
      eyebrow: "User engagement",
      description: "Encourages freelancers and employers to complete incomplete profiles with personalized, cooldown-aware reminders.",
      icon: UserRoundCheck,
      accent: "violet",
      schedule: "Daily",
      audience: "Freelancers & employers",
    },
    {
      id: "job-match" as const,
      name: "Job Match",
      eyebrow: "Marketplace growth",
      description: "Finds the strongest skills-based job match for each eligible freelancer and sends a professional recommendation.",
      icon: BriefcaseBusiness,
      accent: "emerald",
      schedule: "Daily",
      audience: "Qualified freelancers",
    },
    {
      id: "csv-email" as const,
      name: "CSV Email Campaign",
      eyebrow: "Custom outreach",
      description: "Upload a contact list, personalize every email from its columns, preview the result, and send a controlled campaign.",
      icon: FileSpreadsheet,
      accent: "blue",
      schedule: "Manual",
      audience: "Uploaded CSV contacts",
    },
  ];

  const enabledCount = Object.values(summaries).filter((summary) => summary.enabled).length;
  const totalReady = Object.values(summaries).reduce((total, summary) => total + summary.recipientCount, 0);

  return (
    <div className="relative min-h-[720px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <section className="relative overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-8 lg:px-10">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-indigo-200">
              <Sparkles className="h-3.5 w-3.5" /> Automation Center
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Automated workflows, one command center.</h2>
            <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-slate-400">
              Monitor TaraWork bots, review their next audience, and manage every automated message from one secure workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadSummaries()}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-black text-white transition hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4" /> Refresh status
          </button>
        </div>
      </section>

      <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5 sm:px-8 lg:px-10">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Active bots", value: `${enabledCount} / ${bots.length}`, icon: Activity, color: "text-emerald-600 bg-emerald-50" },
            { label: "Ready recipients", value: totalReady.toLocaleString(), icon: Users, color: "text-indigo-600 bg-indigo-50" },
            { label: "Automation health", value: Object.values(summaries).some((item) => item.error) ? "Needs review" : "Operational", icon: CheckCircle2, color: "text-violet-600 bg-violet-50" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className={`rounded-xl p-2.5 ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
              <div><p className="text-lg font-black text-slate-900">{stat.value}</p><p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{stat.label}</p></div>
            </div>
          ))}
        </div>
      </div>

      <section className="px-6 py-7 sm:px-8 lg:px-10">
        <div className="mb-5">
          <h3 className="text-lg font-black text-slate-900">Your automated bots</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">Open a bot to edit its rules, message template, and eligible audience.</p>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          {bots.map((bot) => {
            const summary = summaries[bot.id];
            const isViolet = bot.accent === "violet";
            const isBlue = bot.accent === "blue";
            return (
              <article key={bot.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className={`h-1.5 ${isViolet ? "bg-gradient-to-r from-violet-500 to-indigo-500" : isBlue ? "bg-gradient-to-r from-blue-500 to-cyan-500" : "bg-gradient-to-r from-emerald-500 to-teal-500"}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`rounded-2xl p-3 ${isViolet ? "bg-violet-50 text-violet-600" : isBlue ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}><bot.icon className="h-6 w-6" /></div>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${summary.loading ? "bg-slate-100 text-slate-500" : summary.error ? "bg-rose-50 text-rose-700" : summary.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      <span className={`h-2 w-2 rounded-full ${summary.loading ? "animate-pulse bg-slate-400" : summary.error ? "bg-rose-500" : summary.enabled ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {summary.loading ? "Checking" : summary.error ? "Attention" : summary.enabled ? "Active" : "Paused"}
                    </span>
                  </div>
                  <p className={`mt-5 text-[10px] font-black uppercase tracking-[0.16em] ${isViolet ? "text-violet-600" : isBlue ? "text-blue-600" : "text-emerald-600"}`}>{bot.eyebrow}</p>
                  <h4 className="mt-1 text-xl font-black text-slate-950">{bot.name} Bot</h4>
                  <p className="mt-2 min-h-12 text-sm font-medium leading-6 text-slate-500">{bot.description}</p>
                  {summary.error && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">{summary.error}</p>}
                  <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4">
                    <div><p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400"><Clock3 className="h-3.5 w-3.5" /> Schedule</p><p className="mt-1 text-sm font-black text-slate-700">{bot.schedule}</p></div>
                    <div><p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400"><Users className="h-3.5 w-3.5" /> Ready now</p><p className="mt-1 text-sm font-black text-slate-700">{summary.loading ? "—" : summary.recipientCount.toLocaleString()} recipients</p></div>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <p className="truncate text-xs font-semibold text-slate-400">{bot.audience}</p>
                    <button type="button" onClick={() => setActiveBot(bot.id)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black text-white transition ${isViolet ? "bg-violet-600 hover:bg-violet-700" : isBlue ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"}`}>
                      Manage bot <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
          <div className="rounded-xl bg-white p-2 text-indigo-600 shadow-sm"><Bot className="h-4 w-4" /></div>
          <div><p className="text-sm font-black text-indigo-950">Safe, admin-controlled delivery</p><p className="mt-1 text-xs font-medium leading-5 text-indigo-700/80">Each bot respects its configured cooldown and requires a professional subject and message before it can be enabled.</p></div>
        </div>
      </section>

      {activeBot === "profile-reminder" && <ProfileReminderAutomation close={() => { setActiveBot(null); void loadSummaries(); }} />}
      {activeBot === "job-match" && <JobMatchAutomation close={() => { setActiveBot(null); void loadSummaries(); }} />}
      {activeBot === "csv-email" && <CsvEmailAutomation close={() => { setActiveBot(null); void loadSummaries(); }} />}
    </div>
  );
}
