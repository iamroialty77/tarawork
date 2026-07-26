"use client";

import { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, RefreshCw, Send, Settings2, X } from "lucide-react";

type Config = { enabled: boolean; threshold: number; subject: string; message: string; cooldownDays: number };
type Recipient = { userId: string; name: string; email: string; jobTitle: string; company: string; score: number; matchedSkills: string[]; missingSkills: string[]; totalRequirements: number };
const initial: Config = { enabled: false, threshold: 50, subject: "", message: "", cooldownDays: 14 };

export default function JobMatchAutomation({ close }: { close: () => void }) {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [config, setConfig] = useState(initial);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [busy, setBusy] = useState(true);
  const [notice, setNotice] = useState("");
  const [isError, setIsError] = useState(false);

  const load = async () => {
    setBusy(true); setIsError(false);
    try {
      const response = await fetch("/api/admin/job-match-automation", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load job match automation.");
      const next = data.recipients || [];
      setConfig(data.config || initial); setRecipients(next); setSelectedUserIds(next.map((recipient: Recipient) => recipient.userId)); setNotice("");
    } catch (error) { setIsError(true); setNotice(error instanceof Error ? error.message : "Unable to load job match automation."); }
    finally { setBusy(false); }
  };
  useEffect(() => { void load(); }, []);

  const insertVariable = (variable: string) => {
    const token = `{{${variable}}}`;
    const textarea = messageRef.current;
    const start = textarea?.selectionStart ?? config.message.length;
    const end = textarea?.selectionEnd ?? config.message.length;
    setConfig((current) => ({ ...current, message: `${current.message.slice(0, start)}${token}${current.message.slice(end)}` }));
    requestAnimationFrame(() => { textarea?.focus(); textarea?.setSelectionRange(start + token.length, start + token.length); });
  };

  const process = async (action: "save" | "preview" | "run") => {
    if (action === "run" && !window.confirm(`Send job matches to ${selectedUserIds.length} selected freelancer${selectedUserIds.length === 1 ? "" : "s"}?`)) return;
    setBusy(true); setNotice(""); setIsError(false);
    try {
      const response = await fetch("/api/admin/job-match-automation", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, config, selectedUserIds }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to process job matches.");
      if (action === "preview") {
        const next = data.recipients || []; setRecipients(next); setSelectedUserIds(next.map((recipient: Recipient) => recipient.userId));
        setNotice(`${data.recipientCount} eligible match${data.recipientCount === 1 ? "" : "es"} loaded.`);
      } else if (action === "run") {
        setNotice(`Complete: ${data.sent} sent${data.failed ? `, ${data.failed} failed` : ""}.`); await load();
      } else { setNotice("Automation settings saved."); setShowSettings(false); }
    } catch (error) { setIsError(true); setNotice(error instanceof Error ? error.message : "Unable to process automation."); }
    finally { setBusy(false); }
  };

  return <div className="absolute inset-0 z-20 flex min-h-[820px] flex-col overflow-y-auto bg-slate-50">
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-7">
      <div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-50 p-2 text-emerald-600"><BriefcaseBusiness className="h-5 w-5" /></div><div><h2 className="text-lg font-black text-slate-900">Job Match Automation</h2><p className="text-xs font-medium text-slate-500">{recipients.length} eligible freelancers</p></div></div>
      <div className="flex items-center gap-2"><button onClick={() => setShowSettings((value) => !value)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"><Settings2 className="h-4 w-4" />{showSettings ? "Hide settings" : "Configure automation"}</button><button onClick={close} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
    </header>
    {notice && <div className={`border-b px-5 py-3 text-sm font-bold md:px-7 ${isError ? "border-rose-100 bg-rose-50 text-rose-700" : "border-emerald-100 bg-emerald-50 text-emerald-700"}`}>{notice}</div>}
    <div className="flex-1 p-5 md:p-7">
      {showSettings && <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between"><h3 className="font-black text-slate-900">Automation settings</h3><label className="inline-flex items-center gap-2 text-xs font-black text-slate-600"><span>{config.enabled ? "Enabled" : "Disabled"}</span><input type="checkbox" checked={config.enabled} onChange={(event) => setConfig({ ...config, enabled: event.target.checked })} className="h-5 w-5 accent-emerald-600" /></label></div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-xs font-black uppercase tracking-wider text-slate-500">Minimum match score<input type="number" min={50} max={100} value={config.threshold} onChange={(event) => setConfig({ ...config, threshold: Number(event.target.value) })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-800" /></label><label className="text-xs font-black uppercase tracking-wider text-slate-500">Same-job cooldown<input type="number" min={1} max={90} value={config.cooldownDays} onChange={(event) => setConfig({ ...config, cooldownDays: Number(event.target.value) })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-800" /></label></div>
        <label className="mt-4 block text-xs font-black uppercase tracking-wider text-slate-500">Professional subject<input value={config.subject} onChange={(event) => setConfig({ ...config, subject: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-400" /></label>
        <div className="mt-4"><p className="text-xs font-black uppercase tracking-wider text-slate-500">Insert personalized field</p><div className="mt-2 flex flex-wrap gap-2">{["name", "job_title", "company", "match_score", "matched_skills", "missing_skills", "job_url"].map((variable) => <button type="button" key={variable} onClick={() => insertVariable(variable)} className="rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 font-mono text-[11px] font-bold text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100">{`{{${variable}}}`}</button>)}</div></div>
        <label className="mt-4 block text-xs font-black uppercase tracking-wider text-slate-500">Professional message<textarea ref={messageRef} value={config.message} onChange={(event) => setConfig({ ...config, message: event.target.value })} rows={7} placeholder="Click a personalized field above to insert it here." className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium leading-6 outline-none focus:border-emerald-400" /></label>
        <div className="mt-4 flex justify-end"><button onClick={() => void process("save")} disabled={busy} className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white disabled:opacity-50">Save settings</button></div>
      </section>}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3"><div><h3 className="text-sm font-black text-slate-900">Eligible freelancers</h3><p className="text-xs text-slate-500">{selectedUserIds.length} of {recipients.length} selected</p></div><button onClick={() => void process("preview")} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 disabled:opacity-50"><RefreshCw className="h-3.5 w-3.5" /> Refresh</button></div>
        <div className="max-h-[500px] overflow-auto">
          <table className="w-full min-w-[760px] text-left text-xs"><thead className="sticky top-0 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="w-12 px-4 py-3"><input type="checkbox" checked={recipients.length > 0 && selectedUserIds.length === recipients.length} onChange={(event) => setSelectedUserIds(event.target.checked ? recipients.map((recipient) => recipient.userId) : [])} className="h-4 w-4 accent-emerald-600" /></th><th className="px-3 py-3">Freelancer</th><th className="px-3 py-3">Best job match</th><th className="px-3 py-3">Matched skills</th><th className="px-4 py-3 text-right">Score</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{recipients.map((recipient) => <tr key={recipient.userId} className="hover:bg-slate-50"><td className="px-4 py-3"><input type="checkbox" checked={selectedUserIds.includes(recipient.userId)} onChange={(event) => setSelectedUserIds((current) => event.target.checked ? [...current, recipient.userId] : current.filter((id) => id !== recipient.userId))} className="h-4 w-4 accent-emerald-600" /></td><td className="px-3 py-3"><p className="font-black text-slate-800">{recipient.name}</p><p className="text-slate-400">{recipient.email}</p></td><td className="px-3 py-3"><p className="font-bold text-slate-700">{recipient.jobTitle}</p><p className="text-slate-400">{recipient.company}</p></td><td className="max-w-64 px-3 py-3 text-emerald-700">{recipient.matchedSkills.join(", ") || "—"}</td><td className="px-4 py-3 text-right"><span className="rounded-lg bg-emerald-50 px-2 py-1 font-black text-emerald-700">{recipient.score}%</span></td></tr>)}</tbody>
          </table>
          {!busy && recipients.length === 0 && <div className="p-12 text-center text-sm font-semibold text-slate-400">No eligible job matches found.</div>}
        </div>
      </section>
      <div className="mt-5 flex justify-end"><button onClick={() => void process("run")} disabled={busy || !config.subject.trim() || !config.message.trim() || selectedUserIds.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50"><Send className="h-4 w-4" />{busy ? "Processing..." : `Send to ${selectedUserIds.length} selected`}</button></div>
    </div>
  </div>;
}
