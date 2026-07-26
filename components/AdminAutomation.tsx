"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  RefreshCw,
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
    if (new URLSearchParams(window.location.search).get("open") === "csv-email") setActiveBot("csv-email");
  }, []);

  const bots = [
    {
      id: "profile-reminder" as const,
      name: "Profile Reminder",
      icon: UserRoundCheck,
      accent: "violet",
      schedule: "Daily",
    },
    {
      id: "job-match" as const,
      name: "Job Match",
      icon: BriefcaseBusiness,
      accent: "emerald",
      schedule: "Daily",
    },
    {
      id: "csv-email" as const,
      name: "CSV Email Campaign",
      icon: FileSpreadsheet,
      accent: "blue",
      schedule: "Manual",
    },
  ];

  const enabledCount = Object.values(summaries).filter((summary) => summary.enabled).length;
  const totalReady = Object.values(summaries).reduce((total, summary) => total + summary.recipientCount, 0);

  return (
    <div className="relative min-h-[820px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <section className="relative overflow-hidden bg-slate-950 px-6 py-6 text-white sm:px-8">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Admin workspace</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">Automation Center</h2>
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

      <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-3 sm:px-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Active bots", value: `${enabledCount} / ${bots.length}`, icon: Activity, color: "text-emerald-600 bg-emerald-50" },
            { label: "Ready recipients", value: totalReady.toLocaleString(), icon: Users, color: "text-indigo-600 bg-indigo-50" },
            { label: "Automation health", value: Object.values(summaries).some((item) => item.error) ? "Needs review" : "Operational", icon: CheckCircle2, color: "text-violet-600 bg-violet-50" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <div className={`rounded-lg p-2 ${stat.color}`}><stat.icon className="h-4 w-4" /></div>
              <div><p className="text-sm font-black text-slate-900">{stat.value}</p><p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p></div>
            </div>
          ))}
        </div>
      </div>

      <section className="px-6 py-6 sm:px-8">
        <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-black uppercase tracking-wider text-slate-500">Workflows</h3><span className="text-xs font-semibold text-slate-400">{bots.length} available</span></div>
        <div className="grid gap-4 lg:grid-cols-3">
          {bots.map((bot) => {
            const summary = summaries[bot.id];
            const isViolet = bot.accent === "violet";
            const isBlue = bot.accent === "blue";
            return (
              <article key={bot.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md">
                <div className={`h-1 ${isViolet ? "bg-gradient-to-r from-violet-500 to-indigo-500" : isBlue ? "bg-gradient-to-r from-blue-500 to-cyan-500" : "bg-gradient-to-r from-emerald-500 to-teal-500"}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`rounded-2xl p-3 ${isViolet ? "bg-violet-50 text-violet-600" : isBlue ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}><bot.icon className="h-6 w-6" /></div>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${summary.loading ? "bg-slate-100 text-slate-500" : summary.error ? "bg-rose-50 text-rose-700" : summary.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      <span className={`h-2 w-2 rounded-full ${summary.loading ? "animate-pulse bg-slate-400" : summary.error ? "bg-rose-500" : summary.enabled ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {summary.loading ? "Checking" : summary.error ? "Attention" : summary.enabled ? "Active" : "Paused"}
                    </span>
                  </div>
                  <h4 className="mt-4 text-base font-black text-slate-950">{bot.name}</h4>
                  {summary.error && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">{summary.error}</p>}
                  <div className="mt-3 grid grid-cols-2 gap-3 border-y border-slate-100 py-3">
                    <div><p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400"><Clock3 className="h-3.5 w-3.5" /> Schedule</p><p className="mt-1 text-sm font-black text-slate-700">{bot.schedule}</p></div>
                    <div><p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400"><Users className="h-3.5 w-3.5" /> Ready now</p><p className="mt-1 text-sm font-black text-slate-700">{summary.loading ? "—" : summary.recipientCount.toLocaleString()} recipients</p></div>
                  </div>
                  <div className="mt-3">
                    <button type="button" onClick={() => setActiveBot(bot.id)} className={`inline-flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-black text-white transition ${isViolet ? "bg-violet-600 hover:bg-violet-700" : isBlue ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"}`}>
                      Manage <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {activeBot === "profile-reminder" && <ProfileReminderAutomation close={() => { setActiveBot(null); void loadSummaries(); }} />}
      {activeBot === "job-match" && <JobMatchAutomation close={() => { setActiveBot(null); void loadSummaries(); }} />}
      {activeBot === "csv-email" && <CsvEmailAutomation close={() => { setActiveBot(null); void loadSummaries(); }} />}
    </div>
  );
}
