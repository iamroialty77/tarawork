import Link from "next/link";
import { ArrowRight, Briefcase, Search, ShieldCheck, Users } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import SiteFooter from "@/components/SiteFooter";

type SeoLandingPageProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryKeyword: string;
  path: string;
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
  path,
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
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "TaraWork",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: absoluteUrl(path),
      },
    ],
  };

  return (
    <>
      <main className="min-h-screen bg-white text-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link href="/" className="text-lg font-black text-teal-800">
            TaraWork.online
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/auth" className="border border-zinc-300 px-4 py-2 text-sm font-bold text-zinc-700 hover:bg-zinc-100">
              Sign In
            </Link>
            <Link href="/auth" className="bg-zinc-950 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800">
              Join Now
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-zinc-200 bg-zinc-950 px-4 py-20 text-white sm:px-6 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">{eyebrow}</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/76">{subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth" className="inline-flex items-center justify-center gap-2 bg-amber-300 px-6 py-4 text-sm font-black text-zinc-950 hover:bg-amber-200">
                Post a Job
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/" className="border border-white/25 bg-white/8 px-6 py-4 text-center text-sm font-black text-white hover:bg-white/14">
                Explore TaraWork
              </Link>
            </div>
          </div>

          <div className="border border-white/14 bg-white/8 p-6 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">Popular Hiring Needs</p>
            <div className="mt-5 grid gap-3">
              {[
                primaryKeyword,
                "hire Filipino virtual assistant",
                "remote freelancers Philippines",
                "freelance jobs Philippines",
              ].map((keyword) => (
                <div key={keyword} className="flex items-start gap-3 border border-white/12 bg-white/10 p-4">
                  <Search className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                  <p className="text-sm font-bold text-white/86">{keyword}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">Hiring Advantages</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">
              A cleaner way to compare remote talent.
            </h2>
            <p className="mt-5 text-lg font-medium leading-8 text-zinc-600">
              TaraWork keeps profiles, job details, and conversations organized so employers can shortlist with less guesswork.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: Users, title: "Skilled Filipino Talent", body: "Find freelancers, virtual assistants, specialists, and remote professionals with practical profile details." },
            { icon: Briefcase, title: "Clear Job Context", body: "Describe the role, budget, schedule, skills, and expectations before applications start." },
            { icon: ShieldCheck, title: "Professional Hiring Flow", body: "Use TaraWork to compare skills, review experience, and move from discovery to hiring with less friction." },
          ].map((item) => (
            <div key={item.title} className="border border-zinc-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center bg-teal-50 text-teal-800">
                <item.icon className="h-6 w-6" />
              </div>
              <h2 className="mt-8 text-2xl font-black text-zinc-950">{item.title}</h2>
              <p className="mt-3 text-base leading-7 text-zinc-600">{item.body}</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">Hiring Guide</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-zinc-950">
              What to know before you hire remote talent from the Philippines
            </h2>
          </div>
          <div className="grid gap-5">
            {sections.map((section) => (
              <article key={section.heading} className="border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black text-zinc-950">{section.heading}</h3>
                <p className="mt-3 text-base leading-8 text-zinc-600">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">Questions</p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-zinc-950">Frequently asked questions</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="border border-zinc-200 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer text-base font-black text-zinc-950">{faq.question}</summary>
                <p className="mt-3 text-sm leading-7 text-zinc-600">{faq.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold">
            <Link href="/hire-filipino-freelancers" className="border border-zinc-200 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-100">
              Hire Filipino Freelancers
            </Link>
            <Link href="/virtual-assistant-philippines" className="border border-zinc-200 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-100">
              Virtual Assistant Philippines
            </Link>
            <Link href="/remote-jobs-philippines" className="border border-zinc-200 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-100">
              Remote Jobs Philippines
            </Link>
            <Link href="/hire-filipino-web-developer" className="border border-zinc-200 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-100">
              Filipino Web Developers
            </Link>
            <Link href="/hire-filipino-social-media-manager" className="border border-zinc-200 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-100">
              Social Media Managers
            </Link>
            <Link href="/virtual-assistant-rates-philippines" className="border border-zinc-200 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-100">
              VA Rates Philippines
            </Link>
            <Link href="/top-remote-jobs-for-filipinos-2026" className="border border-zinc-200 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-100">
              Top Remote Jobs
            </Link>
            <Link href="/how-to-hire-online-filipino-talent-safely" className="border border-zinc-200 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-100">
              Safe Hiring Guide
            </Link>
            <Link href="/flexible-remote-jobs-for-filipino-students" className="border border-zinc-200 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-100">
              Student Remote Jobs
            </Link>
            <Link href="/best-freelance-niche-philippines" className="border border-zinc-200 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-100">
              Freelance Niches
            </Link>
          </div>
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}
