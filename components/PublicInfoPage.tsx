import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export type InfoSection = { heading: string; paragraphs?: string[]; bullets?: string[] };

export default function PublicInfoPage({ eyebrow, title, introduction, sections, updated = "July 20, 2026" }: { eyebrow: string; title: string; introduction: string; sections: InfoSection[]; updated?: string }) {
  return <div className="min-h-screen bg-slate-50 text-slate-950">
    <SiteHeader />
    <main className="mx-auto max-w-4xl px-5 py-12 sm:py-16"><Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600"><ArrowLeft className="h-4 w-4" />Back to TaraWork</Link><p className="mt-10 text-xs font-black uppercase tracking-[0.22em] text-indigo-600">{eyebrow}</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{title}</h1><p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-slate-600">{introduction}</p><p className="mt-4 text-xs font-bold text-slate-400">Last updated: {updated}</p>
      <div className="mt-10 space-y-6">{sections.map((section) => <section key={section.heading} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-black">{section.heading}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-4 text-sm font-medium leading-7 text-slate-600">{paragraph}</p>)}{section.bullets && <ul className="mt-4 list-disc space-y-2 pl-5 text-sm font-medium leading-7 text-slate-600">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}</div>
      <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white"><h2 className="font-black">Questions or concerns?</h2><p className="mt-2 text-sm leading-6 text-slate-300">Contact TaraWork at <a className="font-bold text-indigo-300 underline" href="mailto:hello@tarawork.online">hello@tarawork.online</a>.</p></div>
    </main>
    <SiteFooter />
  </div>;
}
