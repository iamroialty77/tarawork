import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";
import { absoluteUrl, defaultOgImage, siteName } from "@/lib/seo";

const title = "Hire a Filipino Web Developer";
const description =
  "Hire Filipino web developers for websites, landing pages, dashboards, ecommerce, Next.js, React, WordPress, APIs, and remote development support.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/hire-filipino-web-developer") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/hire-filipino-web-developer"),
    siteName,
    title,
    description,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultOgImage.url],
  },
};

export default function HireFilipinoWebDeveloperPage() {
  return (
    <SeoLandingPage
      eyebrow="Filipino Web Developers"
      title="Hire a Filipino web developer for remote website and app projects"
      subtitle="Find Filipino web developers for business websites, landing pages, SaaS dashboards, ecommerce stores, API integrations, bug fixes, and ongoing technical support."
      primaryKeyword="hire Filipino web developer"
      path="/hire-filipino-web-developer"
      sections={[
        {
          heading: "What Filipino web developers can build",
          body: "Filipino web developers can help with marketing websites, React and Next.js apps, WordPress sites, ecommerce storefronts, admin dashboards, API integrations, database-backed tools, performance fixes, responsive layouts, and ongoing website maintenance. TaraWork helps employers describe the work clearly and connect with developers who match the required skill set.",
        },
        {
          heading: "How to evaluate a remote developer",
          body: "Look for portfolio examples, code or project links, framework experience, communication habits, availability, timezone overlap, and examples of previous client outcomes. A strong developer profile should explain the kind of projects they handle, the tools they use, and the scope they can realistically deliver.",
        },
        {
          heading: "Post a clear technical brief",
          body: "A strong job post should include the product goal, required stack, deliverables, timeline, budget range, existing assets, integrations, and success criteria. Clear public job pages help developers decide whether they are a good fit before applying.",
        },
      ]}
      faqs={[
        {
          question: "Where can I hire Filipino web developers?",
          answer: "You can use TaraWork to post web development jobs, share project requirements, and review Filipino developer profiles with skills, portfolio work, services, and work experience.",
        },
        {
          question: "What web technologies can I hire for?",
          answer: "Common needs include React, Next.js, WordPress, ecommerce, landing pages, APIs, dashboards, responsive frontend work, backend integrations, and website maintenance.",
        },
        {
          question: "Should I hire hourly or project-based?",
          answer: "Hourly is useful for ongoing support and flexible tasks. Project-based pricing works better when the scope, timeline, deliverables, and acceptance criteria are clearly defined.",
        },
      ]}
    />
  );
}
