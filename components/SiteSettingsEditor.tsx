"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, Eye, Globe2, Loader2, Mail, MapPin, Monitor, Phone, Save, Search, Settings2, Share2 } from "lucide-react";
import type { SiteSettings } from "@/lib/siteSettingsShared";
import SeoSettingsWorkspace from "./SeoSettingsWorkspace";

const empty: SiteSettings = {
  contactEmail: "", contactPhone: "", address: "", mapsUrl: "", facebookUrl: "", linkedinUrl: "",
  instagramUrl: "", youtubeUrl: "", xUrl: "", seoTitle: "", seoDescription: "", seoKeywords: [],
  googleSiteVerification: "", bingSiteVerification: "", gaMeasurementId: "", gtmContainerId: "", canonicalUrl: "",
  ogTitle: "", ogDescription: "", ogImageUrl: "", twitterCardType: "summary_large_image", searchIndexing: true,
};

type View = "general" | "seo" | "preview";

export default function SiteSettingsEditor() {
  const [settings, setSettings] = useState<SiteSettings>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState<View>("seo");
  const [previewVersion, setPreviewVersion] = useState(0);

  useEffect(() => {
    fetch("/api/site-settings", { cache: "no-store" }).then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to load settings.");
      setSettings(payload.settings);
    }).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load settings."))
      .finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => setSettings((current) => ({ ...current, [key]: value }));
  const save = async () => {
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/site-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to save settings.");
      setSettings(payload.settings); setNotice("Site settings published successfully."); setPreviewVersion((current) => current + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save settings."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex min-h-[520px] items-center justify-center rounded-3xl border border-slate-200 bg-white"><div className="text-center"><Loader2 className="mx-auto h-7 w-7 animate-spin text-indigo-600" /><p className="mt-3 text-xs font-bold text-slate-400">Loading site workspace…</p></div></div>;

  return <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <header className="border-b border-slate-800 bg-slate-950 px-5 py-5 text-white sm:px-7">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3"><div className="rounded-2xl bg-indigo-500 p-3 shadow-lg shadow-indigo-950"><Globe2 className="h-5 w-5" /></div><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Public website</p><h1 className="mt-1 text-xl font-black">Site Settings</h1><p className="mt-1 text-xs font-medium text-slate-400">Manage business information, search growth, and the live experience.</p></div></div>
        <nav className="flex w-full gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 xl:w-auto">{[
          { id: "general", label: "General", icon: Settings2 }, { id: "seo", label: "SEO Control Center", icon: Search }, { id: "preview", label: "Live Preview", icon: Eye },
        ].map((item) => <button key={item.id} onClick={() => setView(item.id as View)} className={`inline-flex min-w-fit flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-black transition xl:flex-none ${view === item.id ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:bg-white/10 hover:text-white"}`}><item.icon className="h-4 w-4" />{item.label}</button>)}</nav>
      </div>
    </header>
    {notice && <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-6 py-3 text-sm font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" />{notice}</div>}
    {error && <div className="border-b border-rose-100 bg-rose-50 px-6 py-3 text-sm font-bold text-rose-700">{error}</div>}

    {view === "seo" && <SeoSettingsWorkspace settings={settings} setSettings={setSettings} save={save} saving={saving} setNotice={setNotice} setError={setError} />}

    {view === "general" && <div className="bg-slate-50/70">
      <div className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Business profile</p><h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Contact & Social Presence</h2><p className="mt-1 text-sm font-medium text-slate-500">Keep the public website and structured business information accurate.</p></div>
      <div className="grid gap-6 p-5 sm:p-7 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-indigo-50 p-2 text-indigo-600"><Mail className="h-4 w-4" /></div><div><h3 className="font-black text-slate-900">Contact information</h3><p className="mt-1 text-xs text-slate-400">Displayed on public pages and structured data.</p></div></div><div className="mt-6 space-y-5"><Field icon={Mail} label="Email address"><input type="email" value={settings.contactEmail} onChange={(event) => update("contactEmail", event.target.value)} className="control" /></Field><Field icon={Phone} label="Contact number"><input value={settings.contactPhone} onChange={(event) => update("contactPhone", event.target.value)} className="control" /></Field><Field icon={MapPin} label="Business address"><textarea rows={4} value={settings.address} onChange={(event) => update("address", event.target.value)} className="control resize-y" /></Field><Field label="Google Maps URL"><input value={settings.mapsUrl} onChange={(event) => update("mapsUrl", event.target.value)} placeholder="https://www.google.com/maps/…" className="control" /></Field></div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-violet-50 p-2 text-violet-600"><Share2 className="h-4 w-4" /></div><div><h3 className="font-black text-slate-900">Social profiles</h3><p className="mt-1 text-xs text-slate-400">Used in the footer and organization schema.</p></div></div><div className="mt-6 space-y-5">{[
          ["facebookUrl", "Facebook URL", "https://facebook.com/…"], ["linkedinUrl", "LinkedIn URL", "https://linkedin.com/company/…"], ["instagramUrl", "Instagram URL", "https://instagram.com/…"], ["youtubeUrl", "YouTube URL", "https://youtube.com/@…"], ["xUrl", "X / Twitter URL", "https://x.com/…"],
        ].map(([key, label, placeholder]) => <Field key={key} label={label}><input value={String(settings[key as keyof SiteSettings])} onChange={(event) => update(key as "facebookUrl", event.target.value)} placeholder={placeholder} className="control" /></Field>)}</div></section>
      </div>
      <div className="flex justify-end border-t border-slate-200 bg-white px-6 py-4 sm:px-8"><button onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "Saving…" : "Save general settings"}</button></div>
    </div>}

    {view === "preview" && <div className="bg-slate-100 p-4 sm:p-6"><div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="rounded-xl bg-white p-2 text-indigo-600 shadow-sm"><Monitor className="h-4 w-4" /></div><div><p className="text-sm font-black text-slate-900">Published website preview</p><p className="text-xs font-medium text-slate-500">This shows the currently saved public landing page.</p></div></div><a href="/admin/site-preview" target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50">Open full preview <ExternalLink className="h-4 w-4" /></a></div><div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-xl"><div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /><div className="ml-3 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-center text-[10px] font-bold text-slate-400">tarawork.online</div></div><iframe key={previewVersion} src={`/admin/site-preview?v=${previewVersion}`} title="TaraWork landing page preview" className="h-[720px] w-full bg-white" /></div></div>}
  </div>;
}

function Field({ icon: Icon, label, children }: { icon?: typeof Mail; label: string; children: React.ReactNode }) { return <label className="block"><span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500">{Icon && <Icon className="h-3.5 w-3.5" />}{label}</span><div className="mt-2">{children}</div></label>; }
