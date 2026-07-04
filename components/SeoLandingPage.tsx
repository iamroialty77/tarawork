import Link from "next/link";
import { Briefcase, CheckCircle2, Search, ShieldCheck, Users } from "lucide-react";

type SeoLandingPageProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryKeyword: string;
  sections: {
    heading: string;
    body: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

export default function SeoLandingPage({
  eyebrow,
  title,
  subtitle,
  primaryKeyword,
  sections,
  faqs,
}: SeoLandingPageProps) {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-lg font-black tracking-tight text-blue-700">
            TaraWork.online
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/auth" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100">
              Sign In
            </Link>
            <Link href="/auth" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
              Join Now
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">{eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth" className="rounded-xl bg-blue-600 px-6 py-3 text-center text-sm font-black text-white hover:bg-blue-700">
                Post a Job
              </Link>
              <Link href="/" className="rounded-xl border border-slate-300 px-6 py-3 text-center text-sm font-black text-slate-700 hover:bg-slate-100">
                Explore TaraWork
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Popular Searches</p>
            <div className="mt-5 grid gap-3">
              {[
                primaryKeyword,
                "hire Filipino virtual assistant",
                "remote freelancers Philippines",
                "freelance jobs Philippines",
              ].map((keyword) => (
                <div key={keyword} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <Search className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <p className="text-sm font-bold text-slate-800">{keyword}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-3">
          {[
            { icon: Users, title: "Skilled Filipino Talent", body: "Find freelancers, virtual assistants, specialists, and remote professionals with practical profile details." },
            { icon: Briefcase, title: "Job and Profile Pages", body: "Public pages help employers share opportunities and help freelancers build discoverable portfolios." },
            { icon: ShieldCheck, title: "Professional Hiring Flow", body: "Use TaraWork to compare skills, review experience, and move from discovery to hiring with less friction." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <item.icon className="h-8 w-8 text-blue-600" />
              <h2 className="mt-4 text-xl font-black text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">Guide</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              What to know before you hire remote talent from the Philippines
            </h2>
          </div>
          <div className="space-y-7">
            {sections.map((section) => (
              <article key={section.heading}>
                <h3 className="text-xl font-black text-slate-900">{section.heading}</h3>
                <p className="mt-2 text-base leading-8 text-slate-700">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto w-full max-w-4xl">
          <h2 className="text-3xl font-black tracking-tight text-slate-950">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer text-base font-black text-slate-900">{faq.question}</summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <p className="flex items-start gap-3 text-sm font-bold leading-6 text-blue-900">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
              TaraWork keeps public marketplace pages indexable while private dashboards, messages, admin routes, APIs, and integrations stay out of search results.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
