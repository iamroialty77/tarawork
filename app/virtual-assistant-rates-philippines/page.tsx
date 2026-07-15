import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";
import { absoluteUrl, remoteWorkOgImage, siteName } from "@/lib/seo";

const title = "Virtual Assistant Rates Philippines";
const description =
  "Learn what affects virtual assistant rates in the Philippines, including task complexity, experience, tools, hours, role scope, and remote hiring expectations.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/virtual-assistant-rates-philippines") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/virtual-assistant-rates-philippines"),
    siteName,
    title,
    description,
    images: [remoteWorkOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [remoteWorkOgImage.url],
  },
};

export default function VirtualAssistantRatesPhilippinesPage() {
  return (
    <SeoLandingPage
      eyebrow="VA Rates Philippines"
      title="Virtual assistant rates in the Philippines and what affects pricing"
      subtitle="Understand how experience, task complexity, tools, hours, and role scope affect virtual assistant pricing when hiring remote talent from the Philippines."
      primaryKeyword="virtual assistant rates Philippines"
      path="/virtual-assistant-rates-philippines"
      sections={[
        {
          heading: "What affects virtual assistant rates",
          body: "Virtual assistant rates depend on the type of work, experience level, communication expectations, software tools, schedule, industry knowledge, and whether the role is general admin or specialist support. A VA handling inbox management and scheduling may price differently from a VA supporting ecommerce operations, CRM workflows, bookkeeping, or lead generation.",
        },
        {
          heading: "How employers should compare pricing",
          body: "Do not compare rates alone. Compare the scope of work, reliability, tool experience, response time, portfolio, client feedback, and ability to work independently. A slightly higher rate can be more cost-effective when the assistant needs less training and delivers cleaner work.",
        },
        {
          heading: "How TaraWork helps with rate clarity",
          body: "TaraWork profiles and job posts can show service details, rate expectations, role category, and work context. This helps employers set realistic budgets and helps virtual assistants communicate the value behind their pricing.",
        },
      ]}
      faqs={[
        {
          question: "How much does a virtual assistant in the Philippines cost?",
          answer: "Rates vary based on experience, task type, schedule, and tools. General admin support, ecommerce operations, customer service, bookkeeping, and marketing support can have different pricing expectations.",
        },
        {
          question: "Is it better to hire hourly or monthly?",
          answer: "Hourly is useful for flexible or uncertain workloads. Monthly arrangements work better for recurring tasks, predictable schedules, and long-term support.",
        },
        {
          question: "How can I avoid underpaying or overpaying?",
          answer: "Write a clear scope, compare relevant experience, review portfolio or work samples, and match compensation to the responsibility level and expected independence of the role.",
        },
      ]}
    />
  );
}
