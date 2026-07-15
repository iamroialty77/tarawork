import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";
import { absoluteUrl, freelanceJobKeywordsPhilippines, remoteWorkOgImage, siteName } from "@/lib/seo";

const title = "Remote Jobs for Filipinos";
const description =
  "Find remote jobs for Filipinos, including freelance work, virtual assistant jobs, customer support, web development, design, writing, ecommerce, and online work from home.";
const path = "/remote-jobs-philippines";
const keywords = [
  "remote jobs for Filipinos",
  "remote jobs Philippines",
  "online jobs for Filipinos",
  "work from home jobs Philippines",
  "freelance jobs Philippines",
  "remote freelance jobs Philippines",
  "Filipino remote workers",
  "Pinoy freelancers",
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
    images: [remoteWorkOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [remoteWorkOgImage.url],
  },
};

export default function RemoteJobsPhilippinesPage() {
  return (
    <SeoLandingPage
      eyebrow="Remote Jobs Philippines"
      title="Remote jobs for Filipinos"
      subtitle="TaraWork helps Filipino professionals build public profiles, discover remote opportunities, and apply to roles from employers looking for skilled online talent."
      primaryKeyword="remote jobs for Filipinos"
      path={path}
      sections={[
        {
          heading: "Remote work categories on TaraWork",
          body: "Remote jobs can include virtual assistance, admin support, customer service, content writing, social media, web development, graphic design, ecommerce support, sales operations, data entry, bookkeeping, project coordination, and business operations work.",
        },
        {
          heading: "How freelancers can improve visibility",
          body: "Freelancers should create a complete profile with a clear headline, skill category, services, portfolio examples, work experience, tools, rate expectations, and a concise explanation of how they help clients. A complete public profile gives search engines and employers better context.",
        },
        {
          heading: "Why public job pages matter",
          body: "A public job page can be shared outside the app and indexed by search engines. This improves discovery for both employers and job seekers, especially when the page includes a clear title, description, required skills, compensation, duration, and application path.",
        },
      ]}
      faqs={[
        {
          question: "Where can I find remote jobs in the Philippines?",
          answer: "TaraWork supports public remote job pages and freelancer profiles for Filipino professionals looking for online work in virtual assistance, support, design, development, writing, and business operations.",
        },
        {
          question: "Can Filipino freelancers publish a public profile?",
          answer: "Yes. TaraWork profiles can show skills, services, experience, portfolio projects, and contact context so employers can understand a freelancer's strengths before reaching out.",
        },
        {
          question: "What makes a remote job page search-friendly?",
          answer: "A search-friendly job page has a specific title, useful description, required skills, compensation details, role category, duration, canonical metadata, and a clean URL that can be indexed.",
        },
      ]}
    />
  );
}
