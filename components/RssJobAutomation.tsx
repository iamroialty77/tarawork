"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Play, Plus, RefreshCw, Rss, Save, Trash2, X } from "lucide-react";
import AutomationToast from "@/components/AutomationToast";

type Feed = { name: string; url: string };
type Config = { enabled: boolean; expiryDays: number; feeds: Feed[] };
type Run = { id: string; trigger_type: string; status: string; inserted_count: number; duplicate_count: number; expired_count: number; errors: string[]; started_at: string };
const initial: Config = { enabled: false, expiryDays: 21, feeds: [{ name: "Himalayas", url: "https://himalayas.app/jobs/rss" }, { name: "Remote OK", url: "https://remoteok.com/remote-jobs.rss" }] };

export default function RssJobAutomation({ close }: { close: () => void }) {
  const [config, setConfig] = useState(initial);
  const [runs, setRuns] = useState<Run[]>([]);
  const [activeJobs, setActiveJobs] = useState(0);
  const [busy, setBusy] = useState(true);
  const [notice, setNotice] = useState("");
  const [isError, setIsError] = useState(false);

  const load = async () => {
    setBusy(true); setIsError(false);
    try {
      const response = await fetch("/api/admin/rss-automation", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load RSS automation.");
      setConfig(data.config || initial); setRuns(data.runs || []); setActiveJobs(Number(data.activeJobCount || 0));
    } catch (error) { setIsError(true); setNotice(error instanceof Error ? error.message : "Unable to load RSS automation."); }
    finally { setBusy(false); }
  };
  useEffect(() => { void load(); }, []);

  const process = async (action: "save" | "run") => {
    if (action === "run" && !window.confirm(`Import jobs from ${config.feeds.length} RSS feed${config.feeds.length === 1 ? "" : "s"}?`)) return;
    setBusy(true); setNotice(""); setIsError(false);
    try {
      const response = await fetch("/api/admin/rss-automation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, config }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to process RSS automation.");
      if (action === "run") {
        await load(); setNotice(`Import complete: ${data.inserted} added, ${data.duplicates} duplicates, ${data.expired} expired${data.errors?.length ? `, ${data.errors.length} feed errors` : ""}.`);
      } else { setConfig(data.config); setNotice("RSS automation settings saved."); }
    } catch (error) { setIsError(true); setNotice(error instanceof Error ? error.message : "Unable to process RSS automation."); }
    finally { setBusy(false); }
  };

  const updateFeed = (index: number, patch: Partial<Feed>) => setConfig((current) => ({ ...current, feeds: current.feeds.map((feed, position) => position === index ? { ...feed, ...patch } : feed) }));

  return <div className="absolute inset-0 z-20 flex min-h-[820px] flex-col overflow-y-auto bg-slate-50">
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-7"><div className="flex items-center gap-3"><div className="rounded-xl bg-orange-50 p-2 text-orange-600"><Rss className="h-5 w-5" /></div><div><h2 className="text-lg font-black text-slate-900">RSS Job Import</h2><p className="text-xs font-medium text-slate-500">{activeJobs} active external jobs · every 6 hours</p></div></div><button onClick={close} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></header>
    {notice && <AutomationToast message={notice} type={isError ? "error" : "success"} onDismiss={() => setNotice("")} />}
    <div className="flex-1 space-y-5 p-5 md:p-7">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between"><div><h3 className="font-black text-slate-900">Automation settings</h3><p className="mt-1 text-xs text-slate-500">Only approved HTTPS feeds are fetched. Original source links remain visible.</p></div><label className="inline-flex items-center gap-2 text-xs font-black text-slate-600"><span>{config.enabled ? "Enabled" : "Disabled"}</span><input type="checkbox" checked={config.enabled} onChange={(event) => setConfig({ ...config, enabled: event.target.checked })} className="h-5 w-5 accent-orange-600" /></label></div>
        <label className="mt-4 block max-w-xs text-xs font-black uppercase tracking-wider text-slate-500">Expire RSS jobs after<input type="number" min={14} max={30} value={config.expiryDays} onChange={(event) => setConfig({ ...config, expiryDays: Number(event.target.value) })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-800" /><span className="mt-1 block text-[10px] font-medium normal-case text-slate-400">14–30 days</span></label>
      </section>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h3 className="font-black text-slate-900">Feed sources</h3><p className="text-xs text-slate-500">{config.feeds.length} of 12 configured</p></div><button onClick={() => setConfig({ ...config, feeds: [...config.feeds, { name: "", url: "" }] })} disabled={config.feeds.length >= 12} className="inline-flex items-center gap-2 rounded-lg border border-orange-200 px-3 py-2 text-xs font-black text-orange-700 disabled:opacity-40"><Plus className="h-3.5 w-3.5" /> Add feed</button></div><div className="divide-y divide-slate-100">{config.feeds.map((feed, index) => <div key={index} className="grid gap-3 p-4 sm:grid-cols-[180px_minmax(0,1fr)_40px]"><input value={feed.name} onChange={(event) => updateFeed(index, { name: event.target.value })} placeholder="Source name" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold" /><div className="relative"><input type="url" value={feed.url} onChange={(event) => updateFeed(index, { url: event.target.value })} placeholder="https://example.com/jobs.xml" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 pr-10 text-sm font-medium" />{feed.url.startsWith("https://") && <a href={feed.url} target="_blank" rel="noreferrer" className="absolute right-3 top-3 text-slate-400"><ExternalLink className="h-4 w-4" /></a>}</div><button onClick={() => setConfig({ ...config, feeds: config.feeds.filter((_, position) => position !== index) })} className="rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Remove feed"><Trash2 className="mx-auto h-4 w-4" /></button></div>)}</div></section>
      <div className="flex flex-wrap justify-end gap-3"><button onClick={() => void load()} disabled={busy} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 disabled:opacity-50"><RefreshCw className="h-4 w-4" /> Refresh</button><button onClick={() => void process("save")} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white disabled:opacity-50"><Save className="h-4 w-4" /> Save</button><button onClick={() => void process("run")} disabled={busy || !config.feeds.length} className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50"><Play className="h-4 w-4" /> Run now</button></div>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h3 className="font-black text-slate-900">Recent runs</h3></div><div className="overflow-auto"><table className="w-full min-w-[680px] text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Started</th><th className="px-3 py-3">Trigger</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-right">Added</th><th className="px-3 py-3 text-right">Duplicates</th><th className="px-4 py-3 text-right">Expired</th></tr></thead><tbody className="divide-y divide-slate-100">{runs.map((run) => <tr key={run.id}><td className="px-4 py-3 font-semibold text-slate-600">{new Date(run.started_at).toLocaleString()}</td><td className="px-3 py-3 capitalize text-slate-500">{run.trigger_type}</td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 font-black ${run.status === "completed" ? "bg-emerald-50 text-emerald-700" : run.status === "failed" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{run.status}</span></td><td className="px-3 py-3 text-right font-black">{run.inserted_count}</td><td className="px-3 py-3 text-right">{run.duplicate_count}</td><td className="px-4 py-3 text-right">{run.expired_count}</td></tr>)}</tbody></table>{!busy && !runs.length && <p className="p-10 text-center text-sm font-semibold text-slate-400">No RSS runs yet.</p>}</div></section>
    </div>
  </div>;
}
