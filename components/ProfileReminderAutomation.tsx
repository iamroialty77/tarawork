"use client";

import { useEffect, useState } from "react";
import { Bot, Send, X } from "lucide-react";

type Config = {
  enabled: boolean;
  threshold: number;
  audience: "all" | "freelancer" | "employer";
  subject: string;
  message: string;
  cooldownDays: number;
};
type Recipient = { id: string; name: string; email: string; role: string; completion: number; missingFields: string[]; profileUrl: string; messageUrl: string };
const initial: Config = { enabled: false, threshold: 50, audience: "all", subject: "", message: "", cooldownDays: 14 };

export default function ProfileReminderAutomation({ close }: { close: () => void }) {
  const [config, setConfig] = useState(initial);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [busy, setBusy] = useState(true);
  const [notice, setNotice] = useState("");

  const load = async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/profile-reminder-automation", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load automation.");
      setConfig(data.config); setRecipients(data.recipients || []);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Unable to load automation."); }
    finally { setBusy(false); }
  };
  useEffect(() => { void load(); }, []);

  const process = async (action: "save" | "preview" | "run") => {
    if (action === "run" && !window.confirm(`Send reminders now to ${recipients.length} eligible users?`)) return;
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/profile-reminder-automation", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, config }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to process automation.");
      if (action === "preview") {
        setRecipients(data.recipients || []);
        setNotice(`${data.recipientCount} eligible user${data.recipientCount === 1 ? "" : "s"} found.`);
      } else if (action === "run") {
        setNotice(`Run complete: ${data.sent} sent${data.failed ? `, ${data.failed} failed` : ""}.`);
        await load();
      } else setNotice(config.enabled ? "Automation saved and enabled." : "Automation saved and disabled.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Unable to process automation."); }
    finally { setBusy(false); }
  };

  return <div className="absolute inset-0 z-20 overflow-y-auto bg-white">
    <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-8">
      <div><div className="flex items-center gap-2"><Bot className="h-5 w-5 text-violet-600" /><h2 className="text-xl font-black text-slate-900">Profile Reminder Automation</h2></div><p className="mt-1 text-sm font-medium text-slate-500">Admin-controlled reminders for incomplete freelancer and employer profiles.</p></div>
      <button onClick={close} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
    </div>
    {notice && <div className="border-b border-violet-100 bg-violet-50 px-5 py-3 text-sm font-bold text-violet-700 md:px-8">{notice}</div>}
    <div className="w-full p-4 md:p-5">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div><p className="font-black text-slate-800">Daily reminder bot</p><p className="text-xs font-medium text-slate-500">The scheduled job runs daily and respects the cooldown.</p></div>
        <label className="inline-flex cursor-pointer items-center gap-3"><span className={`text-xs font-black ${config.enabled ? "text-emerald-700" : "text-slate-500"}`}>{config.enabled ? "Enabled" : "Disabled"}</span><input type="checkbox" checked={config.enabled} onChange={(event) => setConfig({ ...config, enabled: event.target.checked })} className="h-5 w-5 accent-violet-600" /></label>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <label className="text-xs font-black uppercase tracking-wider text-slate-500">Audience<select value={config.audience} onChange={(event) => setConfig({ ...config, audience: event.target.value as Config["audience"] })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold normal-case tracking-normal text-slate-800"><option value="all">Freelancers & employers</option><option value="freelancer">Freelancers only</option><option value="employer">Employers only</option></select></label>
        <label className="text-xs font-black uppercase tracking-wider text-slate-500">Profile threshold<input type="number" min={0} max={100} value={config.threshold} onChange={(event) => setConfig({ ...config, threshold: Number(event.target.value) })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold normal-case tracking-normal text-slate-800" /><span className="mt-1 block text-[10px] font-medium normal-case tracking-normal text-slate-400">At or below this percentage.</span></label>
        <label className="text-xs font-black uppercase tracking-wider text-slate-500">Cooldown days<input type="number" min={1} max={90} value={config.cooldownDays} onChange={(event) => setConfig({ ...config, cooldownDays: Number(event.target.value) })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold normal-case tracking-normal text-slate-800" /><span className="mt-1 block text-[10px] font-medium normal-case tracking-normal text-slate-400">Prevents repeated emails.</span></label>
      </div>
      <label className="mt-5 block text-xs font-black uppercase tracking-wider text-slate-500">Subject<input value={config.subject} onChange={(event) => setConfig({ ...config, subject: event.target.value })} placeholder="Write your professional email subject" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" /></label>
      <label className="mt-5 block text-xs font-black uppercase tracking-wider text-slate-500">Message<textarea value={config.message} onChange={(event) => setConfig({ ...config, message: event.target.value })} rows={9} placeholder="Write your professional reminder message here..." className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium leading-7 normal-case tracking-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" /></label>
      <p className="mt-2 text-xs font-medium text-slate-400">Available fields: {"{{name}}"}, {"{{role}}"}, {"{{completion}}"}, {"{{profile_url}}"}, {"{{missing_fields}}"}. In the HTML email, the user name is clickable and opens Messages.</p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-black text-slate-800">Eligible recipients</p><p className="text-xs font-medium text-slate-500">{recipients.length} user{recipients.length === 1 ? "" : "s"} can receive the next reminder.</p></div><button onClick={() => void process("preview")} disabled={busy} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 disabled:opacity-50">Refresh preview</button></div>
        {recipients.length > 0 && <div className="mt-3 max-h-56 divide-y divide-slate-200 overflow-y-auto rounded-xl border border-slate-200 bg-white">{recipients.map((recipient) => <div key={recipient.id} className="flex items-center gap-3 px-3 py-2.5 text-xs"><div className="min-w-0 flex-1"><a href={`/messages?with=${encodeURIComponent(recipient.id)}&official=1`} className="truncate font-black text-indigo-700 hover:underline">{recipient.name}</a><p className="truncate text-slate-400">{recipient.email} · {recipient.role}</p><p className="mt-1 truncate font-semibold text-amber-700">Missing: {recipient.missingFields.join(", ") || "None"}</p></div><a href={recipient.profileUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-amber-50 px-2 py-1 font-black text-amber-700 hover:bg-amber-100">{recipient.completion}%</a></div>)}</div>}
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-3"><button onClick={() => void process("save")} disabled={busy} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 disabled:opacity-50">Save settings</button><button onClick={() => void process("run")} disabled={busy || !config.subject.trim() || !config.message.trim() || recipients.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-black text-white disabled:opacity-50"><Send className="h-4 w-4" />{busy ? "Processing..." : "Send reminders now"}</button></div>
    </div>
  </div>;
}
