"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Filter,
  Gauge,
  Loader2,
  Play,
  Plus,
  RefreshCw,
  Rss,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import AutomationToast from "@/components/AutomationToast";

type Feed = { name: string; url: string };
type Config = {
  enabled: boolean;
  expiryDays: number;
  minimumQualityScore: number;
  maximumScamRiskScore: number;
  excludeUsOnly: boolean;
  useLocalAi: boolean;
  feeds: Feed[];
};
type Run = {
  id: string;
  trigger_type: string;
  status: string;
  inserted_count: number;
  duplicate_count: number;
  rejected_count: number;
  ai_processed_count: number;
  ai_fallback_count: number;
  expired_count: number;
  errors: string[];
  started_at: string;
};
type LocalAiStatus = {
  configured: boolean;
  provider: string;
  model: string;
  endpointType: string;
};

const initial: Config = {
  enabled: false,
  expiryDays: 21,
  minimumQualityScore: 55,
  maximumScamRiskScore: 35,
  excludeUsOnly: true,
  useLocalAi: true,
  feeds: [
    { name: "Himalayas", url: "https://himalayas.app/jobs/rss" },
    { name: "Remote OK", url: "https://remoteok.com/remote-jobs.rss" },
  ],
};

const numberValue = (value: number | undefined) =>
  Number(value || 0).toLocaleString();

export default function RssJobAutomation({ close }: { close: () => void }) {
  const [config, setConfig] = useState(initial);
  const [runs, setRuns] = useState<Run[]>([]);
  const [activeJobs, setActiveJobs] = useState(0);
  const [localAi, setLocalAi] = useState<LocalAiStatus | null>(null);
  const [busy, setBusy] = useState(true);
  const [action, setAction] = useState<"load" | "save" | "run" | null>("load");
  const [notice, setNotice] = useState("");
  const [isError, setIsError] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    setAction("load");
    setIsError(false);
    try {
      const response = await fetch("/api/admin/rss-automation", {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to load RSS automation.");
      setConfig(data.config || initial);
      setRuns(data.runs || []);
      setActiveJobs(Number(data.activeJobCount || 0));
      setLocalAi(data.localAi || null);
    } catch (error) {
      setIsError(true);
      setNotice(
        error instanceof Error
          ? error.message
          : "Unable to load RSS automation.",
      );
    } finally {
      setBusy(false);
      setAction(null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const process = async (nextAction: "save" | "run") => {
    if (
      nextAction === "run" &&
      !window.confirm(
        `Curate jobs from ${config.feeds.length} RSS source${config.feeds.length === 1 ? "" : "s"} now?`,
      )
    )
      return;
    setBusy(true);
    setAction(nextAction);
    setNotice("");
    setIsError(false);
    try {
      const response = await fetch("/api/admin/rss-automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: nextAction, config }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to process RSS automation.");
      if (nextAction === "run") {
        await load();
        setNotice(
          `${data.inserted} curated, ${data.duplicates} duplicates, ${data.rejected || 0} filtered. Local AI processed ${data.aiProcessed || 0}; fallback handled ${data.aiFallback || 0}.`,
        );
      } else {
        setConfig(data.config);
        setNotice("RSS curation settings saved.");
      }
    } catch (error) {
      setIsError(true);
      setNotice(
        error instanceof Error
          ? error.message
          : "Unable to process RSS automation.",
      );
    } finally {
      setBusy(false);
      setAction(null);
    }
  };

  const updateFeed = (index: number, patch: Partial<Feed>) =>
    setConfig((current) => ({
      ...current,
      feeds: current.feeds.map((feed, position) =>
        position === index ? { ...feed, ...patch } : feed,
      ),
    }));
  const lastRun = runs[0];

  return (
    <div className="absolute inset-0 z-20 min-h-[820px] overflow-y-auto bg-slate-50">
      {notice && (
        <AutomationToast
          message={notice}
          type={isError ? "error" : "success"}
          onDismiss={() => setNotice("")}
        />
      )}

      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-3 text-white shadow-lg shadow-orange-100">
              <Rss className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-950">
                  RSS Curation Engine
                </h2>
                <span
                  className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wider ${config.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                >
                  {config.enabled ? "Active" : "Paused"}
                </span>
              </div>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Deduplicate, classify, score and rank external opportunities.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={() => void load()}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${action === "load" ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              type="button"
              onClick={close}
              aria-label="Close RSS automation"
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="space-y-6 p-5 md:p-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<Activity />}
            label="Active curated jobs"
            value={numberValue(activeJobs)}
            tone="indigo"
          />
          <MetricCard
            icon={<Sparkles />}
            label="Last run curated"
            value={numberValue(lastRun?.inserted_count)}
            tone="violet"
          />
          <MetricCard
            icon={<Filter />}
            label="Last run filtered"
            value={numberValue(
              (lastRun?.duplicate_count || 0) + (lastRun?.rejected_count || 0),
            )}
            tone="amber"
          />
          <MetricCard
            icon={<Bot />}
            label="AI classified"
            value={numberValue(lastRun?.ai_processed_count)}
            tone="emerald"
          />
        </section>

        <section
          className={`rounded-2xl border p-5 shadow-sm ${localAi?.configured ? "border-emerald-200 bg-emerald-50/70" : "border-amber-200 bg-amber-50/70"}`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div
                className={`rounded-xl p-2.5 ${localAi?.configured ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
              >
                {localAi?.configured ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Local AI connection
                </p>
                <h3 className="mt-1 font-black text-slate-900">
                  {localAi?.configured
                    ? `${localAi.model} is ready`
                    : "Deterministic fallback is active"}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {localAi?.configured
                    ? `Connected through ${localAi.endpointType}. Safety rules remain authoritative when the model is uncertain.`
                    : "Check BLOG_AI_BASE_URL, BLOG_AI_API_KEY and BLOG_AI_MODEL in the deployment environment."}
                </p>
              </div>
            </div>
            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${localAi?.configured ? "bg-white text-emerald-700" : "bg-white text-amber-700"}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${localAi?.configured ? "bg-emerald-500" : "bg-amber-500"}`}
              />
              {localAi?.configured ? "Connected" : "Fallback"}
            </span>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-indigo-600" />
                <h3 className="font-black text-slate-900">Curation policy</h3>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Tune acceptance thresholds without redeploying.
              </p>
            </div>
            <div className="space-y-5 p-5">
              <ToggleRow
                label="Scheduled automation"
                description="Run the RSS pipeline every six hours."
                checked={config.enabled}
                onChange={(enabled) => setConfig({ ...config, enabled })}
              />
              <ToggleRow
                label="Local Docker AI"
                description="Use the Cloudflare-connected model for enrichment."
                checked={config.useLocalAi}
                onChange={(useLocalAi) => setConfig({ ...config, useLocalAi })}
                disabled={!localAi?.configured}
              />
              <ToggleRow
                label="Exclude US-only jobs"
                description="Remove listings requiring US residency or authorization."
                checked={config.excludeUsOnly}
                onChange={(excludeUsOnly) =>
                  setConfig({ ...config, excludeUsOnly })
                }
              />
              <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                <NumberField
                  label="Expiry"
                  suffix="days"
                  value={config.expiryDays}
                  min={14}
                  max={30}
                  onChange={(expiryDays) =>
                    setConfig({ ...config, expiryDays })
                  }
                />
                <NumberField
                  label="Min quality"
                  suffix="/100"
                  value={config.minimumQualityScore}
                  min={30}
                  max={90}
                  onChange={(minimumQualityScore) =>
                    setConfig({ ...config, minimumQualityScore })
                  }
                />
                <NumberField
                  label="Max scam risk"
                  suffix="/100"
                  value={config.maximumScamRiskScore}
                  min={0}
                  max={80}
                  onChange={(maximumScamRiskScore) =>
                    setConfig({ ...config, maximumScamRiskScore })
                  }
                />
              </div>
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void process("save")}
                  disabled={busy}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
                >
                  {action === "save" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save policy
                </button>
                <button
                  type="button"
                  onClick={() => void process("run")}
                  disabled={busy || !config.feeds.length}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-black text-white shadow-sm shadow-orange-100 hover:bg-orange-700 disabled:opacity-50"
                >
                  {action === "run" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Run curation
                </button>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-orange-600" />
                  <h3 className="font-black text-slate-900">
                    Approved feed sources
                  </h3>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Only HTTPS feeds with original attribution links are accepted.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    feeds: [...config.feeds, { name: "", url: "" }],
                  })
                }
                disabled={config.feeds.length >= 12}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-black text-orange-700 hover:bg-orange-100 disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                Add source{" "}
                <span className="text-orange-400">
                  {config.feeds.length}/12
                </span>
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {config.feeds.map((feed, index) => (
                <div
              key={index}
                  className="grid gap-3 p-4 sm:grid-cols-[150px_minmax(0,1fr)_40px]"
                >
                  <label>
                    <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Source
                    </span>
                    <input
                      value={feed.name}
                      onChange={(event) =>
                        updateFeed(index, { name: event.target.value })
                      }
                      placeholder="Source name"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-400">
                      RSS endpoint
                    </span>
                    <div className="relative">
                      <input
                        type="url"
                        value={feed.url}
                        onChange={(event) =>
                          updateFeed(index, { url: event.target.value })
                        }
                        placeholder="https://example.com/jobs.xml"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 pr-10 text-sm text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />
                      {feed.url.startsWith("https://") && (
                        <a
                          href={feed.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${feed.name || "RSS"} feed`}
                          className="absolute right-3 top-3 text-slate-400 hover:text-orange-600"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig({
                        ...config,
                        feeds: config.feeds.filter(
                          (_, position) => position !== index,
                        ),
                      })
                    }
                    aria-label={`Remove ${feed.name || "feed"}`}
                    className="mt-5 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="mx-auto h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            {!config.feeds.length && (
              <div className="p-10 text-center">
                <Rss className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-3 text-sm font-bold text-slate-500">
                  No feed sources configured
                </p>
              </div>
            )}
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-indigo-600" />
                <h3 className="font-black text-slate-900">Run history</h3>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Latest ingestion, AI and safety-filter outcomes.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-3">Started</th>
                  <th className="px-3 py-3">Trigger</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Curated</th>
                  <th className="px-3 py-3 text-right">Duplicates</th>
                  <th className="px-3 py-3 text-right">Filtered</th>
                  <th className="px-3 py-3 text-right">AI</th>
                  <th className="px-3 py-3 text-right">Fallback</th>
                  <th className="px-5 py-3 text-right">Expired</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {runs.map((run) => (
                  <tr key={run.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-bold text-slate-700">
                      {new Date(run.started_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-3.5 capitalize text-slate-500">
                      {run.trigger_type}
                    </td>
                    <td className="px-3 py-3.5">
                      <RunStatus status={run.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right font-black text-emerald-700">
                      {numberValue(run.inserted_count)}
                    </td>
                    <td className="px-3 py-3.5 text-right text-slate-600">
                      {numberValue(run.duplicate_count)}
                    </td>
                    <td className="px-3 py-3.5 text-right text-slate-600">
                      {numberValue(run.rejected_count)}
                    </td>
                    <td className="px-3 py-3.5 text-right font-bold text-violet-700">
                      {numberValue(run.ai_processed_count)}
                    </td>
                    <td className="px-3 py-3.5 text-right text-amber-700">
                      {numberValue(run.ai_fallback_count)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-slate-600">
                      {numberValue(run.expired_count)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!busy && !runs.length && (
            <div className="p-12 text-center">
              <Clock3 className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-500">
                No curation runs yet
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Run the pipeline to generate the first report.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "indigo" | "violet" | "amber" | "emerald";
}) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700",
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`inline-flex rounded-xl p-2.5 [&>svg]:h-4 [&>svg]:w-4 ${colors[tone]}`}
      >
        {icon}
      </div>
      <p className="mt-4 text-2xl font-black tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 ${disabled ? "opacity-50" : "cursor-pointer"}`}
    >
      <span>
        <span className="block text-sm font-black text-slate-800">{label}</span>
        <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">
          {description}
        </span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-orange-600" : "bg-slate-300"}`}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          className="sr-only"
        />
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`}
        />
      </span>
    </label>
  );
}

function NumberField({
  label,
  suffix,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 pr-12 text-sm font-black text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
        <span className="absolute right-3 top-3 text-[10px] font-bold text-slate-400">
          {suffix}
        </span>
      </div>
    </label>
  );
}

function RunStatus({ status }: { status: string }) {
  const failed = status === "failed";
  const completed = status === "completed";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-black capitalize ${completed ? "bg-emerald-50 text-emerald-700" : failed ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}
    >
      {completed ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : failed ? (
        <XCircle className="h-3 w-3" />
      ) : (
        <Loader2 className="h-3 w-3 animate-spin" />
      )}
      {status}
    </span>
  );
}
