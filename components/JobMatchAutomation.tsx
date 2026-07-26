"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Send, X } from "lucide-react";

type Config = { enabled: boolean; threshold: number; subject: string; message: string; cooldownDays: number };
type Recipient = { userId: string; name: string; email: string; jobTitle: string; company: string; score: number; matchedSkills: string[]; missingSkills: string[]; totalRequirements: number };
const initial: Config = { enabled: false, threshold: 50, subject: "", message: "", cooldownDays: 14 };

export default function JobMatchAutomation({ close }: { close: () => void }) {
  const [config, setConfig] = useState(initial);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(true);
  const [notice, setNotice] = useState("");

  const load = async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/job-match-automation", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load job match automation.");
      setConfig(data.config); setRecipients(data.recipients || []); setSelectedUserIds((data.recipients || []).map((recipient: Recipient) => recipient.userId));
    } catch (error) { setNotice(error instanceof Error ? error.message : "Unable to load automation."); }
    finally { setBusy(false); }
  };
  useEffect(() => { void load(); }, []);

  const process = async (action: "save" | "preview" | "run") => {
    if (action === "run" && !window.confirm(`Send the best matching job to ${selectedUserIds.length} selected freelancer${selectedUserIds.length === 1 ? "" : "s"}?`)) return;
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/job-match-automation", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, config, selectedUserIds }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to process job matches.");
      if (action === "preview") {
        setRecipients(data.recipients || []);
        setSelectedUserIds((data.recipients || []).map((recipient: Recipient) => recipient.userId));
        setNotice(`${data.recipientCount} professional job match${data.recipientCount === 1 ? "" : "es"} ready.`);
      } else if (action === "run") {
        setNotice(`Job match run complete: ${data.sent} sent${data.failed ? `, ${data.failed} failed` : ""}.`);
        await load();
      } else setNotice(config.enabled ? "Job Match Automation saved and enabled." : "Job Match Automation saved and disabled.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Unable to process automation."); }
    finally { setBusy(false); }
  };

  return <div className="absolute inset-0 z-20 overflow-y-auto bg-white">
    <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-8">
      <div><div className="flex items-center gap-2"><BriefcaseBusiness className="h-5 w-5 text-emerald-600" /><h2 className="text-xl font-black text-slate-900">Job Match Automation</h2></div><p className="mt-1 text-sm font-medium text-slate-500">Professionally notify freelancers when an active job matches their profile.</p></div>
      <button onClick={close} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
    </div>
    {notice && <div className="border-b border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 md:px-8">{notice}</div>}
    <div className="w-full p-4 md:p-5">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div><p className="font-black text-slate-800">Daily skills-based job matching</p><p className="text-xs font-medium text-slate-500">Score = matched required job skills ÷ total required job skills. Each freelancer receives only their highest-scoring unsent match.</p></div>
        <label className="inline-flex cursor-pointer items-center gap-3"><span className={`text-xs font-black ${config.enabled ? "text-emerald-700" : "text-slate-500"}`}>{config.enabled ? "Enabled" : "Disabled"}</span><input type="checkbox" checked={config.enabled} onChange={(event) => setConfig({ ...config, enabled: event.target.checked })} className="h-5 w-5 accent-emerald-600" /></label>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-black uppercase tracking-wider text-slate-500">Minimum match score<input type="number" min={50} max={100} value={config.threshold} onChange={(event) => setConfig({ ...config, threshold: Number(event.target.value) })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold normal-case tracking-normal text-slate-800" /><span className="mt-1 block text-[10px] font-medium normal-case tracking-normal text-slate-400">Only matches at or above this percentage.</span></label>
        <label className="text-xs font-black uppercase tracking-wider text-slate-500">Same-job cooldown<input type="number" min={1} max={90} value={config.cooldownDays} onChange={(event) => setConfig({ ...config, cooldownDays: Number(event.target.value) })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold normal-case tracking-normal text-slate-800" /><span className="mt-1 block text-[10px] font-medium normal-case tracking-normal text-slate-400">Avoids repeatedly recommending the same job.</span></label>
      </div>
      <label className="mt-5 block text-xs font-black uppercase tracking-wider text-slate-500">Professional subject<input value={config.subject} onChange={(event) => setConfig({ ...config, subject: event.target.value })} placeholder="Write the email subject" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" /></label>
      <label className="mt-5 block text-xs font-black uppercase tracking-wider text-slate-500">Professional message<textarea value={config.message} onChange={(event) => setConfig({ ...config, message: event.target.value })} rows={9} placeholder="Write the job match message here..." className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium leading-7 normal-case tracking-normal outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" /></label>
      <p className="mt-2 text-xs font-medium text-slate-400">Available fields: {"{{name}}"}, {"{{job_title}}"}, {"{{company}}"}, {"{{match_score}}"}, {"{{matched_skills}}"}, {"{{missing_skills}}"}, {"{{job_url}}"}.</p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-black text-slate-800">Professional match preview</p><p className="text-xs font-medium text-slate-500">{selectedUserIds.length} of {recipients.length} eligible freelancers selected.</p></div><button onClick={() => void process("preview")} disabled={busy} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 disabled:opacity-50">Refresh matches</button></div>
        {recipients.length > 0 && <><label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700"><input type="checkbox" checked={selectedUserIds.length === recipients.length} onChange={(event) => setSelectedUserIds(event.target.checked ? recipients.map((recipient) => recipient.userId) : [])} className="h-4 w-4 accent-emerald-600" /> Select all eligible freelancers</label><div className="mt-2 max-h-64 divide-y divide-slate-200 overflow-y-auto rounded-xl border border-slate-200 bg-white">{recipients.map((recipient) => <label key={`${recipient.userId}-${recipient.jobTitle}`} className="flex cursor-pointer items-center gap-3 px-3 py-3 text-xs hover:bg-slate-50"><input type="checkbox" checked={selectedUserIds.includes(recipient.userId)} onChange={(event) => setSelectedUserIds((current) => event.target.checked ? [...current, recipient.userId] : current.filter((id) => id !== recipient.userId))} className="h-4 w-4 shrink-0 accent-emerald-600" /><div className="min-w-0 flex-1"><p className="truncate font-black text-slate-700">{recipient.name} → {recipient.jobTitle}</p><p className="truncate text-slate-400">{recipient.company} · {recipient.email}</p><p className="mt-1 truncate font-semibold text-emerald-700">{recipient.matchedSkills.length ? `Matched: ${recipient.matchedSkills.join(", ")}` : "No matched keyword"}</p>{recipient.missingSkills.length > 0 && <p className="mt-1 truncate font-medium text-amber-700">Missing: {recipient.missingSkills.join(", ")}</p>}<p className="mt-1 text-[10px] font-bold text-slate-400">{recipient.matchedSkills.length} of {recipient.totalRequirements} detected requirements matched</p></div><span className="rounded-lg bg-emerald-50 px-2 py-1 font-black text-emerald-700">{recipient.score}%</span></label>)}</div></>}
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-3"><button onClick={() => void process("save")} disabled={busy} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 disabled:opacity-50">Save settings</button><button onClick={() => void process("run")} disabled={busy || !config.subject.trim() || !config.message.trim() || selectedUserIds.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-black text-white disabled:opacity-50"><Send className="h-4 w-4" />{busy ? "Processing..." : `Send to ${selectedUserIds.length} selected`}</button></div>
    </div>
  </div>;
}
