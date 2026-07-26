"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Globe2, Loader2, Mail, MapPin, Phone, Save, Share2 } from "lucide-react";
import type { SiteSettings } from "@/lib/siteSettingsShared";

const empty: SiteSettings = { contactEmail: "", contactPhone: "", address: "", mapsUrl: "", facebookUrl: "", linkedinUrl: "", instagramUrl: "", youtubeUrl: "", xUrl: "" };

export default function SiteSettingsEditor() {
  const [settings, setSettings] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/site-settings", { cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load settings.");
      setSettings(data.settings);
    }).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load settings.")).finally(() => setLoading(false));
  }, []);

  const update = (field: keyof SiteSettings, value: string) => setSettings((current) => ({ ...current, [field]: value }));
  const save = async () => {
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/site-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save settings.");
      setSettings(data.settings); setNotice("Landing page contact and social links updated.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save settings."); }
    finally { setSaving(false); }
  };

  const fields: Array<{ key: keyof SiteSettings; label: string; placeholder: string }> = [
    { key: "facebookUrl", label: "Facebook URL", placeholder: "https://facebook.com/..." },
    { key: "linkedinUrl", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/..." },
    { key: "instagramUrl", label: "Instagram URL", placeholder: "https://instagram.com/..." },
    { key: "youtubeUrl", label: "YouTube URL", placeholder: "https://youtube.com/@..." },
    { key: "xUrl", label: "X / Twitter URL", placeholder: "https://x.com/..." },
  ];

  if (loading) return <div className="flex min-h-80 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>;
  return <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <div className="bg-slate-950 px-6 py-6 text-white sm:px-8"><div className="flex items-center gap-3"><div className="rounded-xl bg-indigo-500/20 p-2.5 text-indigo-300"><Globe2 className="h-5 w-5" /></div><div><h2 className="text-xl font-black">Landing Page Settings</h2><p className="mt-1 text-xs font-medium text-slate-400">Manage the public footer contact details and social channels.</p></div></div></div>
    {notice && <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-6 py-3 text-sm font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" />{notice}</div>}
    {error && <div className="border-b border-rose-100 bg-rose-50 px-6 py-3 text-sm font-bold text-rose-700">{error}</div>}
    <div className="grid gap-6 p-6 lg:grid-cols-2 sm:p-8">
      <section className="rounded-2xl border border-slate-200 p-5"><div className="mb-5 flex items-center gap-2"><Mail className="h-4 w-4 text-indigo-600" /><h3 className="font-black text-slate-900">Contact information</h3></div><div className="space-y-4">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-500"><span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />Email</span><input type="email" value={settings.contactEmail} onChange={(event) => update("contactEmail", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-500"><span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />Contact number</span><input value={settings.contactPhone} onChange={(event) => update("contactPhone", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-500"><span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />Address</span><textarea rows={3} value={settings.address} onChange={(event) => update("address", event.target.value)} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Google Maps URL<input value={settings.mapsUrl} onChange={(event) => update("mapsUrl", event.target.value)} placeholder="https://www.google.com/maps/..." className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
      </div></section>
      <section className="rounded-2xl border border-slate-200 p-5"><div className="mb-5 flex items-center gap-2"><Share2 className="h-4 w-4 text-indigo-600" /><h3 className="font-black text-slate-900">Social media</h3></div><div className="space-y-4">{fields.map((field) => <label key={field.key} className="block text-xs font-black uppercase tracking-wider text-slate-500">{field.label}<input value={settings[field.key]} onChange={(event) => update(field.key, event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>)}</div></section>
    </div>
    <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8"><button onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "Saving..." : "Save changes"}</button></div>
  </div>;
}
