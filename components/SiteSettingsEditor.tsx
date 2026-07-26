"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, Eye, Globe2, ImageIcon, Loader2, Mail, MapPin, Monitor, Phone, Save, Search, Settings2, Share2 } from "lucide-react";
import type { SiteSettings } from "@/lib/siteSettingsShared";

const empty: SiteSettings = {
  contactEmail: "", contactPhone: "", address: "", mapsUrl: "", facebookUrl: "", linkedinUrl: "",
  instagramUrl: "", youtubeUrl: "", xUrl: "", seoTitle: "", seoDescription: "", canonicalUrl: "",
  ogTitle: "", ogDescription: "", ogImageUrl: "", searchIndexing: true,
};

export default function SiteSettingsEditor() {
  const [settings, setSettings] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState<"edit" | "seo" | "preview">("edit");
  const [previewVersion, setPreviewVersion] = useState(0);

  useEffect(() => {
    fetch("/api/site-settings", { cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load settings.");
      setSettings(data.settings);
    }).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load settings.")).finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof SiteSettings,>(field: K, value: SiteSettings[K]) => setSettings((current) => ({ ...current, [field]: value }));
  const save = async () => {
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/site-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save settings.");
      setSettings(data.settings); setNotice("Landing page settings updated."); setPreviewVersion((version) => version + 1);
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
    <div className="bg-slate-950 px-6 py-6 text-white sm:px-8"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-3"><div className="rounded-xl bg-indigo-500/20 p-2.5 text-indigo-300"><Globe2 className="h-5 w-5" /></div><div><h2 className="text-xl font-black">Landing Page Settings</h2><p className="mt-1 text-xs font-medium text-slate-400">Manage public content, search visibility, and the live landing page.</p></div></div><div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5"><button type="button" onClick={() => setView("edit")} className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-black transition ${view === "edit" ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10"}`}><Settings2 className="h-4 w-4" /> Contact & social</button><button type="button" onClick={() => setView("seo")} className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-black transition ${view === "seo" ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10"}`}><Search className="h-4 w-4" /> SEO</button><button type="button" onClick={() => setView("preview")} className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-black transition ${view === "preview" ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10"}`}><Eye className="h-4 w-4" /> Preview</button></div></div></div>
    {notice && <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-6 py-3 text-sm font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" />{notice}</div>}
    {error && <div className="border-b border-rose-100 bg-rose-50 px-6 py-3 text-sm font-bold text-rose-700">{error}</div>}
    {view === "edit" ? <><div className="grid gap-6 p-6 lg:grid-cols-2 sm:p-8">
      <section className="rounded-2xl border border-slate-200 p-5"><div className="mb-5 flex items-center gap-2"><Mail className="h-4 w-4 text-indigo-600" /><h3 className="font-black text-slate-900">Contact information</h3></div><div className="space-y-4">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-500"><span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />Email</span><input type="email" value={settings.contactEmail} onChange={(event) => update("contactEmail", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-500"><span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />Contact number</span><input value={settings.contactPhone} onChange={(event) => update("contactPhone", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-500"><span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />Address</span><textarea rows={3} value={settings.address} onChange={(event) => update("address", event.target.value)} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Google Maps URL<input value={settings.mapsUrl} onChange={(event) => update("mapsUrl", event.target.value)} placeholder="https://www.google.com/maps/..." className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
      </div></section>
      <section className="rounded-2xl border border-slate-200 p-5"><div className="mb-5 flex items-center gap-2"><Share2 className="h-4 w-4 text-indigo-600" /><h3 className="font-black text-slate-900">Social media</h3></div><div className="space-y-4">{fields.map((field) => <label key={field.key} className="block text-xs font-black uppercase tracking-wider text-slate-500">{field.label}<input value={settings[field.key]} onChange={(event) => update(field.key, event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>)}</div></section>
    </div>
    <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8"><button onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "Saving..." : "Save changes"}</button></div></> : view === "seo" ? <>
      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)] sm:p-8">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="mb-5 flex items-start gap-3"><div className="rounded-xl bg-indigo-50 p-2 text-indigo-600"><Search className="h-4 w-4" /></div><div><h3 className="font-black text-slate-900">Search appearance</h3><p className="mt-1 text-xs font-medium text-slate-500">Control how the home page may appear in Google and other search engines.</p></div></div>
            <div className="space-y-5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">SEO title <span className={`float-right normal-case tracking-normal ${settings.seoTitle.length > 60 ? "text-amber-600" : "text-slate-400"}`}>{settings.seoTitle.length}/60 recommended</span><input maxLength={70} value={settings.seoTitle} onChange={(event) => update("seoTitle", event.target.value)} placeholder="Tara Work | Remote Jobs in the Philippines" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Meta description <span className={`float-right normal-case tracking-normal ${settings.seoDescription.length > 160 ? "text-amber-600" : "text-slate-400"}`}>{settings.seoDescription.length}/160 recommended</span><textarea rows={4} maxLength={180} value={settings.seoDescription} onChange={(event) => update("seoDescription", event.target.value)} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Canonical URL<input type="url" value={settings.canonicalUrl} onChange={(event) => update("canonicalUrl", event.target.value)} placeholder="https://www.tarawork.online/" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /><span className="mt-2 block text-[11px] font-medium normal-case tracking-normal text-slate-400">Use the preferred HTTPS address of the public landing page.</span></label>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"><span><span className="block text-sm font-black text-slate-800">Allow search indexing</span><span className="mt-1 block text-xs font-medium text-slate-500">When disabled, the landing page sends a noindex instruction.</span></span><input type="checkbox" checked={settings.searchIndexing} onChange={(event) => update("searchIndexing", event.target.checked)} className="h-5 w-5 rounded border-slate-300 text-indigo-600" /></label>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="mb-5 flex items-start gap-3"><div className="rounded-xl bg-violet-50 p-2 text-violet-600"><ImageIcon className="h-4 w-4" /></div><div><h3 className="font-black text-slate-900">Social sharing</h3><p className="mt-1 text-xs font-medium text-slate-500">Customize the preview used by Facebook, LinkedIn, X, and messaging apps.</p></div></div>
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Social title<input maxLength={70} value={settings.ogTitle} onChange={(event) => update("ogTitle", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Social description<textarea rows={3} maxLength={200} value={settings.ogDescription} onChange={(event) => update("ogDescription", event.target.value)} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Social image URL<input value={settings.ogImageUrl} onChange={(event) => update("ogImageUrl", event.target.value)} placeholder="/landing/share-image.png or https://..." className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /><span className="mt-2 block text-[11px] font-medium normal-case tracking-normal text-slate-400">Recommended size: 1200 × 630 pixels.</span></label>
            </div>
          </section>
        </div>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-5 xl:sticky xl:top-6">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">Google preview</p>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">T</div><div><p className="text-sm text-slate-800">Tara Work</p><p className="max-w-[280px] truncate text-xs text-slate-500">{settings.canonicalUrl || "https://www.tarawork.online/"}</p></div></div><p className="mt-3 line-clamp-2 text-xl font-medium text-blue-800">{settings.seoTitle || "Landing page title"}</p><p className="mt-2 text-sm leading-6 text-slate-600">{settings.seoDescription || "Add a clear description of Tara Work for search results."}</p></div>
          <p className="mt-6 text-xs font-black uppercase tracking-wider text-slate-500">Social preview</p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{settings.ogImageUrl ? <div className="aspect-[1.91/1] bg-slate-100"><img src={settings.ogImageUrl} alt="" className="h-full w-full object-cover" /></div> : <div className="flex aspect-[1.91/1] items-center justify-center bg-slate-100 text-slate-400"><ImageIcon className="h-8 w-8" /></div>}<div className="p-4"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">tarawork.online</p><p className="mt-1 font-black text-slate-900">{settings.ogTitle || settings.seoTitle || "Tara Work"}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{settings.ogDescription || settings.seoDescription}</p></div></div>
        </aside>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8"><p className="text-xs font-medium text-slate-500">Changes take effect after saving and the next page request.</p><button onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "Saving..." : "Save SEO settings"}</button></div>
    </> :
      <div className="bg-slate-100 p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="rounded-xl bg-white p-2 text-indigo-600 shadow-sm"><Monitor className="h-4 w-4" /></div><div><p className="text-sm font-black text-slate-900">Desktop preview</p><p className="text-xs font-medium text-slate-500">Shows the currently saved public landing page.</p></div></div><a href="/admin/site-preview" target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50">Open full preview <ExternalLink className="h-4 w-4" /></a></div>
        <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-xl"><div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /><div className="ml-3 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-center text-[10px] font-bold text-slate-400">tarawork.online</div></div><iframe key={previewVersion} src={`/admin/site-preview?v=${previewVersion}`} title="TaraWork landing page preview" className="h-[720px] w-full bg-white" /></div>
      </div>}
  </div>;
}
