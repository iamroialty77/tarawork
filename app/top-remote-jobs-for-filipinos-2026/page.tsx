import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";
import { absoluteUrl, siteName } from "@/lib/seo";

const title = "Top Remote Jobs for Filipinos in 2026";
const description =
  "Explore top remote jobs for Filipinos in 2026, including virtual assistant, customer support, web development, design, writing, and ecommerce roles.";
const path = "/top-remote-jobs-for-filipinos-2026";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl(path) },
  openGraph: {
    type: "website",
    url: absoluteUrl(path),
    siteName,
    title,
    description,
    images: ["/tarawork-removebg-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/tarawork-removebg-preview.png"],
  },
};

export default function TopRemoteJobsForFilipinos2026Page() {
  return (
    <SeoLandingPage
      eyebrow="Remote Jobs for Filipinos"
      title="Top remote jobs for Filipinos in 2026"
      subtitle="A practical guide for Filipino freelancers and online professionals who want remote work in support, operations, creative, technical, and business service roles."
      primaryKeyword="top remote jobs for Filipinos 2026"
      path={path}
      sections={[
        {
          heading: "High-demand remote roles for Filipino talent",
          body: "Common remote roles for Filipinos include virtual assistant, customer support specialist, social media manager, web developer, graphic designer, content writer, ecommerce assistant, bookkeeper, data entry specialist, appointment setter, and project coordinator.",
        },
        {
          heading: "How to choose the right remote job path",
          body: "Start with your strongest skill, then match it to a role with clear client demand. Admin and support roles are good for organized communicators, while design, development, writing, and automation roles reward stronger portfolios and technical proof.",
        },
        {
          heading: "How TaraWork helps Filipino freelancers get found",
          body: "TaraWork profiles let Filipino freelancers show services, skills, rates, portfolio projects, tools, and work background in one public page that employers can review before starting a hiring conversation.",
        },
      ]}
      faqs={[
        {
          question: "What remote jobs are popular for Filipinos in 2026?",
          answer: "Popular remote jobs include virtual assistant, customer support, social media management, web development, graphic design, content writing, ecommerce support, bookkeeping, and operations coordination.",
        },
        {
          question: "Do I need experience to apply for remote jobs?",
          answer: "Experience helps, but beginners can start with clear service offers, sample work, tool familiarity, and a complete profile that explains what tasks they can handle reliably.",
        },
        {
          question: "How can Filipino freelancers stand out online?",
          answer: "A strong profile should include a focused headline, service category, portfolio examples, tools used, availability, rate expectations, and a short explanation of client outcomes.",
        },
      ]}
    />
  );
}
