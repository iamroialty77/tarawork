"use client";

import { X } from "lucide-react";

export default function AdminProfileEditorModal({ draft, setDraft, saving, close, save }: {
  draft: any;
  setDraft: (updater: (current: any) => any) => void;
  saving: boolean;
  close: () => void;
  save: () => void;
}) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
    <div role="dialog" aria-modal="true" aria-labelledby="admin-profile-editor-title" className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/20 bg-white shadow-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
        <div><p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Verification Queue</p><h4 id="admin-profile-editor-title" className="mt-1 text-xl font-black capitalize text-slate-900">Edit {draft.role} profile</h4></div>
        <button type="button" onClick={close} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
      </div>
      <div className="grid gap-6 p-5 sm:p-6">
        <section><h5 className="text-xs font-black uppercase tracking-widest text-slate-400">Account</h5><div className="mt-3 grid gap-4 md:grid-cols-2">
          <Field label="Full name"><input value={draft.name} onChange={(e) => setDraft((value) => ({ ...value, name: e.target.value }))} maxLength={160} className={inputClass} /></Field>
          <Field label="Username"><input value={draft.username} onChange={(e) => setDraft((value) => ({ ...value, username: e.target.value }))} maxLength={80} placeholder="public-profile-name" className={inputClass} /></Field>
          <Field label="Account type"><select value={draft.role} onChange={(e) => setDraft((value) => ({ ...value, role: e.target.value }))} className={inputClass}><option value="freelancer">Freelancer</option><option value="employer">Employer</option></select></Field>
          <Field label="Verification status"><select value={draft.status} onChange={(e) => setDraft((value) => ({ ...value, status: e.target.value }))} className={inputClass}><option value="pending">Pending</option><option value="approved">Approved</option><option value="suspended">Suspended</option></select></Field>
        </div></section>
        <section className="border-t border-slate-100 pt-5"><h5 className="text-xs font-black uppercase tracking-widest text-slate-400">Public profile</h5><div className="mt-3 grid gap-4 md:grid-cols-2">
          <Field label="Category"><input value={draft.category} onChange={(e) => setDraft((value) => ({ ...value, category: e.target.value }))} maxLength={120} className={inputClass} /></Field>
          <Field label="Avatar URL"><input type="url" value={draft.avatarUrl} onChange={(e) => setDraft((value) => ({ ...value, avatarUrl: e.target.value }))} placeholder="https://..." className={inputClass} /></Field>
          <Field label="Bio" wide><textarea value={draft.bio} onChange={(e) => setDraft((value) => ({ ...value, bio: e.target.value }))} rows={5} maxLength={5000} className={`${inputClass} resize-y leading-6`} /></Field>
          {draft.role === "freelancer" ? <>
            <Field label="Skills (comma-separated)" wide><input value={draft.skills} onChange={(e) => setDraft((value) => ({ ...value, skills: e.target.value }))} placeholder="Virtual Assistance, SEO, Canva" className={inputClass} /></Field>
            <Field label="Hourly rate"><input value={draft.hourlyRate} onChange={(e) => setDraft((value) => ({ ...value, hourlyRate: e.target.value }))} placeholder="PHP 500 / hour" className={inputClass} /></Field>
          </> : <Field label="Company name"><input value={draft.companyName} onChange={(e) => setDraft((value) => ({ ...value, companyName: e.target.value }))} maxLength={180} className={inputClass} /></Field>}
          <Field label="Preferred currency"><select value={draft.preferredCurrency} onChange={(e) => setDraft((value) => ({ ...value, preferredCurrency: e.target.value }))} className={inputClass}>{["PHP", "USD", "EUR", "GBP", "AUD", "CAD", "SGD"].map((currency) => <option key={currency}>{currency}</option>)}</select></Field>
        </div></section>
      </div>
      <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6"><button type="button" onClick={close} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-100">Cancel</button><button type="button" onClick={save} disabled={saving || !draft.name.trim()} className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-black text-white hover:bg-indigo-700 disabled:opacity-50">{saving ? "Saving..." : "Save profile"}</button></div>
    </div>
  </div>;
}

const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-400";
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={`text-xs font-black text-slate-600 ${wide ? "md:col-span-2" : ""}`}>{label}{children}</label>;
}
