import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";
import { absoluteUrl, siteName } from "@/lib/seo";

const title = "Hire Filipino Freelancers for Remote Work";
const description =
  "Hire Filipino freelancers for virtual assistance, design, development, writing, customer support, admin work, ecommerce, and remote business operations.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/hire-filipino-freelancers") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/hire-filipino-freelancers"),
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

export default function HireFilipinoFreelancersPage() {
  return (
    <SeoLandingPage
      eyebrow="Hire Filipino Freelancers"
      title="Hire Filipino freelancers for remote work, business support, and project-based services"
      subtitle="TaraWork helps employers discover Filipino freelancers with professional profiles, service details, skills, portfolios, and public job pages built for remote hiring."
      primaryKeyword="hire Filipino freelancers"
      sections={[
        {
          heading: "Why companies hire Filipino freelancers",
          body: "Filipino freelancers are often hired for strong English communication, client service experience, adaptability, and familiarity with remote collaboration tools. Businesses use TaraWork to find talent for administrative support, design, development, content, marketing, sales support, customer service, bookkeeping, ecommerce operations, and project coordination.",
        },
        {
          heading: "What makes a strong freelancer profile",
          body: "A useful profile should explain the freelancer's specialty, services offered, portfolio work, tools used, rate range, work style, and relevant experience. TaraWork public profiles are designed to give employers enough context to compare candidates before starting a hiring conversation.",
        },
        {
          heading: "How TaraWork supports search visibility",
          body: "Public job posts and freelancer profiles can be indexed by search engines, while private account areas remain blocked. This helps employers share roles publicly and helps freelancers build discoverable pages around their name, service category, skills, and portfolio work.",
        },
      ]}
      faqs={[
        {
          question: "Where can I hire Filipino freelancers online?",
          answer: "You can use TaraWork to post remote jobs, review freelancer profiles, compare portfolios, and connect with Filipino professionals for virtual assistance, development, design, writing, support, and operations work.",
        },
        {
          question: "What services can Filipino freelancers provide?",
          answer: "Common services include virtual assistance, admin support, customer service, content writing, social media management, web development, graphic design, ecommerce support, data entry, bookkeeping, and project coordination.",
        },
        {
          question: "Can freelancers use TaraWork to get discovered?",
          answer: "Yes. Public profiles help freelancers show skills, services, portfolio projects, and work experience in a search-friendly format that can be shared with clients.",
        },
      ]}
    />
  );
}
