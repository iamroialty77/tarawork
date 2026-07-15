import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";
import { absoluteUrl, freelanceJobKeywordsPhilippines, siteName } from "@/lib/seo";

const title = "How to Hire Online Filipino Talent";
const description =
  "A Filipino freelancers hiring guide for employers. Learn how to hire online Filipino talent safely with clear roles, profile reviews, portfolios, expectations, and structured communication.";
const path = "/how-to-hire-online-filipino-talent-safely";
const keywords = [
  "how to hire online Filipino talent",
  "hire online Filipino talent",
  "filipino freelancers hiring site",
  "Filipino freelancers hiring guide",
  "hire Filipino freelancers safely",
  "hire remote Filipino talent",
  "hire Filipino virtual assistant",
  "hire Pinoy freelancers",
  ...freelanceJobKeywordsPhilippines,
];

export const metadata: Metadata = {
  title,
  description,
  keywords,
  alternates: { canonical: absoluteUrl(path) },
  openGraph: {
    type: "website",
    url: absoluteUrl(path),
    siteName,
    title,
    description,
    locale: "en_PH",
    images: ["/landing/filipino-collaboration.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/landing/filipino-collaboration.png"],
  },
};

export default function HowToHireOnlineFilipinoTalentSafelyPage() {
  return (
    <SeoLandingPage
      eyebrow="Hiring Guide"
      title="How to hire online Filipino talent"
      subtitle="A clear hiring process helps employers compare Filipino freelancers, avoid vague expectations, and start remote work with better context."
      primaryKeyword="hire online Filipino talent"
      path={path}
      sections={[
        {
          heading: "Start with a specific role description",
          body: "Write the work scope, required skills, tools, time zone expectations, budget, weekly workload, and success metrics. Clear job details reduce mismatched applications and help serious freelancers respond with relevant experience.",
        },
        {
          heading: "Review proof before moving forward",
          body: "Look for portfolio work, service details, past roles, client-facing communication, tool experience, and examples that match the work you need. A complete public profile gives you more context than a short message alone.",
        },
        {
          heading: "Use a structured first conversation",
          body: "Ask about availability, preferred workflow, similar projects, expected turnaround, communication rhythm, and how they handle revisions. Start with a small trial or clearly scoped milestone when the role is new.",
        },
      ]}
      faqs={[
        {
          question: "What should I check before hiring Filipino freelancers online?",
          answer: "Review their profile, portfolio, services, tools, communication style, availability, rate expectations, and fit for the exact tasks you need done.",
        },
        {
          question: "How do I avoid hiring mistakes?",
          answer: "Avoid vague job posts, unclear budgets, and rushed decisions. Compare profiles, ask role-specific questions, document expectations, and begin with a defined scope.",
        },
        {
          question: "Can TaraWork help employers compare candidates?",
          answer: "Yes. TaraWork is designed around public profiles, service details, portfolios, and job pages so employers can compare Filipino remote talent with clearer context.",
        },
      ]}
    />
  );
}
