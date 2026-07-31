"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, Eye, Globe2, ImageIcon, Loader2, Mail, MapPin, Monitor, Phone, Plus, RefreshCw, Save, Search, Settings2, Share2, Sparkles, Target, TrendingUp, X } from "lucide-react";
import type { SiteSettings } from "@/lib/siteSettingsShared";

const empty: SiteSettings = {
  contactEmail: "", contactPhone: "", address: "", mapsUrl: "", facebookUrl: "", linkedinUrl: "",
  instagramUrl: "", youtubeUrl: "", xUrl: "", seoTitle: "", seoDescription: "", seoKeywords: [], googleSiteVerification: "",
  bingSiteVerification: "", gaMeasurementId: "", gtmContainerId: "", canonicalUrl: "",
  ogTitle: "", ogDescription: "", ogImageUrl: "", twitterCardType: "summary_large_image", searchIndexing: true,
};

export default function SiteSettingsEditor() {
  const [settings, setSettings] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState<"edit" | "seo" | "preview">("edit");
  const [previewVersion, setPreviewVersion] = useState(0);
  const [keywordDraft, setKeywordDraft] = useState("");
  const [keywordSeed, setKeywordSeed] = useState("remote jobs Philippines");
  const [keywordSuggestions, setKeywordSuggestions] = useState<Array<{ keyword: string; score: number; intent: string; competition: string; sources: string[] }>>([]);
  const [keywordMethodology, setKeywordMethodology] = useState("");
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/site-settings", { cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load settings.");
      setSettings(data.settings);
    }).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load settings.")).finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof SiteSettings,>(field: K, value: SiteSettings[K]) => setSettings((current) => ({ ...current, [field]: value }));
  const addKeyword = () => {
    const keyword = keywordDraft.trim();
    if (!keyword || settings.seoKeywords.length >= 20 || settings.seoKeywords.some((item) => item.toLowerCase() === keyword.toLowerCase())) return;
    update("seoKeywords", [...settings.seoKeywords, keyword.slice(0, 60)]);
    setKeywordDraft("");
  };
  const discoverKeywords = async () => {
    setKeywordLoading(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/seo-keywords?seed=${encodeURIComponent(keywordSeed)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to analyze keywords.");
      setKeywordSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
      setKeywordMethodology(data.methodology || "");
      setSelectedSuggestions([]);
      setNotice(`Keyword analysis completed with ${data.suggestions?.length || 0} opportunities.`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to analyze keywords."); }
    finally { setKeywordLoading(false); }
  };
  const applySuggestedKeywords = () => {
    const additions = keywordSuggestions.filter((item) => selectedSuggestions.includes(item.keyword)).map((item) => item.keyword);
    const merged = [...settings.seoKeywords, ...additions].filter((keyword, index, list) => list.findIndex((item) => item.toLowerCase() === keyword.toLowerCase()) === index).slice(0, 20);
    update("seoKeywords", merged); setSelectedSuggestions([]); setNotice(`${merged.length - settings.seoKeywords.length} keyword opportunities added. Save SEO settings to publish.`);
  };
  const applyAutomatedSeoDraft = () => {
    const primary = selectedSuggestions[0] || keywordSuggestions[0]?.keyword;
    if (!primary) return;
    const displayKeyword = primary.replace(/\b\w/g, (character) => character.toUpperCase());
    const title = `${displayKeyword} | TaraWork`.slice(0, 60);
    const description = `Discover ${primary} on TaraWork. Find trusted remote opportunities, skilled Filipino professionals, and practical tools for successful online work.`.slice(0, 160);
    const merged = [primary, ...settings.seoKeywords].filter((keyword, index, list) => list.findIndex((item) => item.toLowerCase() === keyword.toLowerCase()) === index).slice(0, 20);
    setSettings((current) => ({ ...current, seoTitle: title, seoDescription: description, seoKeywords: merged, ogTitle: title, ogDescription: description }));
    setSelectedSuggestions([]); setNotice(`SEO draft optimized around “${primary}”. Review it, then save to publish.`);
  };
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

  const fields: Array<{ key: "facebookUrl" | "linkedinUrl" | "instagramUrl" | "youtubeUrl" | "xUrl"; label: string; placeholder: string }> = [
    { key: "facebookUrl", label: "Facebook URL", placeholder: "https://facebook.com/..." },
    { key: "linkedinUrl", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/..." },
    { key: "instagramUrl", label: "Instagram URL", placeholder: "https://instagram.com/..." },
    { key: "youtubeUrl", label: "YouTube URL", placeholder: "https://youtube.com/@..." },
    { key: "xUrl", label: "X / Twitter URL", placeholder: "https://x.com/..." },
  ];
  const siteOrigin = (() => {
    try { return new URL(settings.canonicalUrl).origin; } catch { return "https://www.tarawork.online"; }
  })();
  const estimatedTitlePixels = Math.round([...settings.seoTitle].reduce((width, character) => {
    if (/[WM@%]/.test(character)) return width + 11;
    if (/[A-Z0-9]/.test(character)) return width + 8;
    if (/[ilI1|.,' ]/.test(character)) return width + 4;
    return width + 7;
  }, 0));
  const titleIssue = settings.seoTitle.length > 60
    ? `Title is ${settings.seoTitle.length - 60} characters over the recommended length.`
    : settings.seoTitle.length < 30
      ? `Title needs at least ${30 - settings.seoTitle.length} more characters.`
      : estimatedTitlePixels > 580
        ? `Title may be truncated at approximately ${estimatedTitlePixels}px.`
        : "SEO title length and estimated pixel width are healthy.";
  const coversKeyword = (text: string, keyword: string) => {
    const haystack = text.toLowerCase();
    const meaningfulWords = keyword.toLowerCase().split(/\s+/).filter((word) => word.length >= 3 && !["the", "and", "for", "with"].includes(word));
    return meaningfulWords.length >= 2 && meaningfulWords.every((word) => haystack.includes(word));
  };
  const seoChecks = [
    { label: titleIssue, passed: settings.seoTitle.length >= 30 && settings.seoTitle.length <= 60 && estimatedTitlePixels <= 580 },
    { label: settings.seoDescription.length > 160 ? `Description is ${settings.seoDescription.length - 160} characters too long.` : "Description is 120–160 characters", passed: settings.seoDescription.length >= 120 && settings.seoDescription.length <= 160 },
    { label: "Canonical URL uses HTTPS", passed: /^https:\/\/.+/i.test(settings.canonicalUrl) },
    { label: "Social sharing image is configured", passed: Boolean(settings.ogImageUrl) },
    { label: "Google Search Console is verified", passed: Boolean(settings.googleSiteVerification) },
    { label: "Search indexing is enabled", passed: settings.searchIndexing },
    { label: "A target keyword is covered by the SEO title", passed: settings.seoKeywords.some((keyword) => coversKeyword(settings.seoTitle, keyword)) },
    { label: "A target keyword is covered by the meta description", passed: settings.seoKeywords.some((keyword) => coversKeyword(settings.seoDescription, keyword)) },
    { label: "At least 3 focused keyword targets are configured", passed: settings.seoKeywords.length >= 3 },
  ];
  const seoScore = Math.round((seoChecks.filter((check) => check.passed).length / seoChecks.length) * 100);

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
          <section className="overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
            <div className="border-b border-indigo-100 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3"><div className="rounded-xl bg-indigo-600 p-2 text-white shadow-lg shadow-indigo-200"><Sparkles className="h-4 w-4" /></div><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">SEO Automation</p><h3 className="mt-1 font-black text-slate-950">Keyword Intelligence</h3><p className="mt-1 max-w-2xl text-xs font-medium leading-5 text-slate-500">Discover relevant search opportunities using Google autocomplete signals plus live TaraWork jobs, talent skills, and published content.</p></div></div>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live signals</span>
              </div>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row"><div className="relative min-w-0 flex-1"><Target className="absolute left-3.5 top-3.5 h-4 w-4 text-indigo-500" /><input value={keywordSeed} onChange={(event) => setKeywordSeed(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void discoverKeywords(); } }} placeholder="Enter a topic, service, or audience" className="w-full rounded-xl border border-indigo-200 bg-white py-3 pl-10 pr-4 text-sm font-bold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></div><button type="button" onClick={() => void discoverKeywords()} disabled={keywordLoading || keywordSeed.trim().length < 3} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">{keywordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : keywordSuggestions.length ? <RefreshCw className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}{keywordLoading ? "Analyzing…" : keywordSuggestions.length ? "Refresh analysis" : "Find keyword opportunities"}</button></div>
            </div>
            {keywordSuggestions.length > 0 ? <div className="p-5">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-slate-500">Ranked opportunities</p><p className="mt-1 text-[11px] text-slate-400">Select focused phrases that accurately match the landing page.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={applyAutomatedSeoDraft} className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-xs font-black text-indigo-700 hover:bg-indigo-50"><Sparkles className="h-3.5 w-3.5" /> Optimize metadata</button><button type="button" onClick={applySuggestedKeywords} disabled={!selectedSuggestions.length || settings.seoKeywords.length >= 20} className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white disabled:opacity-40">Add selected ({selectedSuggestions.length})</button></div></div>
              <div className="max-h-[390px] overflow-auto rounded-xl border border-slate-200 bg-white"><table className="w-full min-w-[650px] text-left"><thead className="sticky top-0 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400"><tr><th className="w-10 px-4 py-3" /><th className="px-3 py-3">Keyword</th><th className="px-3 py-3">Intent</th><th className="px-3 py-3">Competition</th><th className="px-4 py-3 text-right">Opportunity</th></tr></thead><tbody className="divide-y divide-slate-100">{keywordSuggestions.map((item) => {
                const selected = selectedSuggestions.includes(item.keyword); const alreadyAdded = settings.seoKeywords.some((keyword) => keyword.toLowerCase() === item.keyword.toLowerCase());
                return <tr key={item.keyword} className={selected ? "bg-indigo-50/70" : "hover:bg-slate-50"}><td className="px-4 py-3"><input type="checkbox" checked={selected || alreadyAdded} disabled={alreadyAdded} onChange={() => setSelectedSuggestions((current) => selected ? current.filter((keyword) => keyword !== item.keyword) : [...current, item.keyword])} className="h-4 w-4 rounded border-slate-300 text-indigo-600" /></td><td className="px-3 py-3"><p className="text-sm font-black capitalize text-slate-900">{item.keyword}</p><p className="mt-1 text-[10px] text-slate-400">{alreadyAdded ? "Already targeted" : item.sources.join(" + ")}</p></td><td className="px-3 py-3"><span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-black text-blue-700">{item.intent}</span></td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-black ${item.competition === "Low" ? "bg-emerald-50 text-emerald-700" : item.competition === "High" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{item.competition}</span></td><td className="px-4 py-3"><div className="ml-auto flex w-24 items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.score >= 80 ? "bg-emerald-500" : item.score >= 60 ? "bg-indigo-500" : "bg-amber-500"}`} style={{ width: `${item.score}%` }} /></div><span className="w-7 text-right text-xs font-black text-slate-700">{item.score}</span></div></td></tr>;
              })}</tbody></table></div>
              {keywordMethodology && <p className="mt-3 text-[10px] font-medium leading-5 text-slate-400">Methodology: {keywordMethodology}</p>}
            </div> : <div className="flex items-center gap-3 p-5 text-xs font-medium text-slate-500"><TrendingUp className="h-5 w-5 text-indigo-400" /><span>Start an analysis to identify focused long-tail keywords and content demand signals.</span></div>}
          </section>
          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="mb-5 flex items-start gap-3"><div className="rounded-xl bg-indigo-50 p-2 text-indigo-600"><Search className="h-4 w-4" /></div><div><h3 className="font-black text-slate-900">Search appearance</h3><p className="mt-1 text-xs font-medium text-slate-500">Control how the home page may appear in Google and other search engines.</p></div></div>
            <div className="space-y-5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">SEO title <span className={`float-right normal-case tracking-normal ${settings.seoTitle.length > 60 || estimatedTitlePixels > 580 ? "text-amber-600" : "text-slate-400"}`}>{settings.seoTitle.length}/60 · ~{estimatedTitlePixels}px</span><input maxLength={70} value={settings.seoTitle} onChange={(event) => update("seoTitle", event.target.value)} placeholder="Tara Work | Remote Jobs in the Philippines" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /><span className={`mt-2 block text-[11px] font-semibold normal-case tracking-normal ${seoChecks[0].passed ? "text-emerald-600" : "text-amber-600"}`}>{titleIssue}</span></label>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Meta description <span className={`float-right normal-case tracking-normal ${settings.seoDescription.length > 160 ? "text-amber-600" : "text-slate-400"}`}>{settings.seoDescription.length}/160 recommended</span><textarea rows={4} maxLength={180} value={settings.seoDescription} onChange={(event) => update("seoDescription", event.target.value)} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
              <div>
                <div className="flex items-center justify-between"><p className="text-xs font-black uppercase tracking-wider text-slate-500">SEO keywords</p><span className="text-[11px] font-semibold text-slate-400">{settings.seoKeywords.length}/20</span></div>
                <div className="mt-2 flex gap-2"><input maxLength={60} value={keywordDraft} onChange={(event) => setKeywordDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addKeyword(); } }} placeholder="e.g. remote jobs Philippines" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold" /><button type="button" onClick={addKeyword} disabled={!keywordDraft.trim() || settings.seoKeywords.length >= 20} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-40"><Plus className="h-4 w-4" /> Add</button></div>
                {settings.seoKeywords.length > 0 ? <div className="mt-3 flex flex-wrap gap-2">{settings.seoKeywords.map((keyword) => <span key={keyword} className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">{keyword}<button type="button" onClick={() => update("seoKeywords", settings.seoKeywords.filter((item) => item !== keyword))} aria-label={`Remove ${keyword}`} className="rounded-full p-0.5 hover:bg-indigo-100"><X className="h-3 w-3" /></button></span>)}</div> : null}
                <p className="mt-2 text-[11px] font-medium leading-5 text-slate-400">Internal target phrases only. Google does not use the meta keywords tag as an important ranking signal, so these do not affect the SEO health score.</p>
              </div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Canonical URL<input type="url" value={settings.canonicalUrl} onChange={(event) => update("canonicalUrl", event.target.value)} placeholder="https://www.tarawork.online/" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /><span className="mt-2 block text-[11px] font-medium normal-case tracking-normal text-slate-400">Use the preferred HTTPS address of the public landing page.</span></label>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"><span><span className="block text-sm font-black text-slate-800">Allow search indexing</span><span className="mt-1 block text-xs font-medium text-slate-500">When disabled, the landing page sends a noindex instruction.</span></span><input type="checkbox" checked={settings.searchIndexing} onChange={(event) => update("searchIndexing", event.target.checked)} className="h-5 w-5 rounded border-slate-300 text-indigo-600" /></label>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="mb-5 flex items-start gap-3"><div className="rounded-xl bg-emerald-50 p-2 text-emerald-600"><Globe2 className="h-4 w-4" /></div><div><h3 className="font-black text-slate-900">Google Search Console</h3><p className="mt-1 text-xs font-medium text-slate-500">Verify ownership, submit the sitemap, and monitor Google search performance.</p></div></div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Google verification token<input value={settings.googleSiteVerification} onChange={(event) => update("googleSiteVerification", event.target.value.replace(/^.*content=["']?([^"']+)["']?.*$/i, "$1").trim())} placeholder="Paste only the content value from Google's HTML tag" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /><span className="mt-2 block text-[11px] font-medium normal-case leading-5 tracking-normal text-slate-400">In Search Console, choose URL prefix → HTML tag, then paste the value inside <code className="rounded bg-slate-100 px-1">content=&quot;...&quot;</code>. Save before clicking Verify.</span></label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Bing verification token<input value={settings.bingSiteVerification} onChange={(event) => update("bingSiteVerification", event.target.value.replace(/^.*content=["']?([^"']+)["']?.*$/i, "$1").trim())} placeholder="msvalidate.01 content value" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">GA4 Measurement ID<input value={settings.gaMeasurementId} onChange={(event) => update("gaMeasurementId", event.target.value.toUpperCase().trim())} placeholder="G-XXXXXXXXXX" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 sm:col-span-2">Google Tag Manager<input value={settings.gtmContainerId} onChange={(event) => update("gtmContainerId", event.target.value.toUpperCase().trim())} placeholder="GTM-XXXXXXX (optional)" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /><span className="mt-2 block text-[11px] font-medium normal-case tracking-normal text-slate-400">Use GA4 directly or manage analytics and marketing tags through GTM.</span></label>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3"><a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50">Search Console <ExternalLink className="h-3.5 w-3.5" /></a><a href={`${siteOrigin}/sitemap.xml`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50">Sitemap <ExternalLink className="h-3.5 w-3.5" /></a><a href={`${siteOrigin}/robots.txt`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50">Robots.txt <ExternalLink className="h-3.5 w-3.5" /></a><a href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(settings.canonicalUrl || siteOrigin)}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50">Rich Results Test <ExternalLink className="h-3.5 w-3.5" /></a><a href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(settings.canonicalUrl || siteOrigin)}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50">PageSpeed <ExternalLink className="h-3.5 w-3.5" /></a><a href="https://search.google.com/search-console/inspect" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50">URL inspection <ExternalLink className="h-3.5 w-3.5" /></a></div>
          </section>
          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="mb-5 flex items-start gap-3"><div className="rounded-xl bg-violet-50 p-2 text-violet-600"><ImageIcon className="h-4 w-4" /></div><div><h3 className="font-black text-slate-900">Social sharing</h3><p className="mt-1 text-xs font-medium text-slate-500">Customize the preview used by Facebook, LinkedIn, X, and messaging apps.</p></div></div>
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Social title<input maxLength={70} value={settings.ogTitle} onChange={(event) => update("ogTitle", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Social description<textarea rows={3} maxLength={200} value={settings.ogDescription} onChange={(event) => update("ogDescription", event.target.value)} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /></label>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Social image URL<input value={settings.ogImageUrl} onChange={(event) => update("ogImageUrl", event.target.value)} placeholder="/landing/share-image.png or https://..." className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal" /><span className="mt-2 block text-[11px] font-medium normal-case tracking-normal text-slate-400">Recommended size: 1200 × 630 pixels.</span></label>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">X / Twitter card type<select value={settings.twitterCardType} onChange={(event) => update("twitterCardType", event.target.value as SiteSettings["twitterCardType"])} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold normal-case tracking-normal"><option value="summary_large_image">Large image card</option><option value="summary">Compact summary card</option></select></label>
            </div>
          </section>
        </div>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-5 xl:sticky xl:top-6">
          <div className="rounded-2xl bg-slate-950 p-5 text-white"><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-slate-400">SEO health</p><p className="mt-1 text-3xl font-black">{seoScore}<span className="text-base text-slate-400">/100</span></p></div><div className={`flex h-14 w-14 items-center justify-center rounded-full border-4 text-sm font-black ${seoScore >= 80 ? "border-emerald-400 text-emerald-300" : seoScore >= 50 ? "border-amber-400 text-amber-300" : "border-rose-400 text-rose-300"}`}>{seoScore}%</div></div><div className="mt-4 space-y-2">{seoChecks.map((check) => <div key={check.label} className="flex items-center gap-2 text-[11px] font-semibold"><CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${check.passed ? "text-emerald-400" : "text-slate-600"}`} /><span className={check.passed ? "text-slate-200" : "text-slate-500"}>{check.label}</span></div>)}</div></div>
          <p className="mt-6 text-xs font-black uppercase tracking-wider text-slate-500">Google preview</p>
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
