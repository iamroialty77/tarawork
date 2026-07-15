import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";
import { absoluteUrl, freelanceJobKeywordsPhilippines, siteName } from "@/lib/seo";

const title = "Best Freelance Niche in the Philippines";
const description =
  "Compare the best freelance niches in the Philippines for online work, remote jobs, virtual assistance, web development, design, writing, support, ecommerce, and automation.";
const path = "/best-freelance-niche-philippines";
const keywords = [
  "best freelance niche Philippines",
  "freelance niche Philippines",
  "profitable freelance niche Philippines",
  "best online work Philippines",
  "best freelance jobs Philippines",
  "freelance jobs for beginners Philippines",
  "freelance jobs for students Philippines",
  "high demand freelance skills Philippines",
  "virtual assistant niche Philippines",
  "remote jobs for Filipinos",
  ...freelanceJobKeywordsPhilippines,
];

export const metadata: Metadata = {
  title,
  description,
  keywords,
  category: "Freelance Jobs Philippines",
  classification: "Freelance marketplace and remote work guide",
  referrer: "origin-when-cross-origin",
  alternates: { canonical: absoluteUrl(path) },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: absoluteUrl(path),
    siteName,
    title,
    description,
    locale: "en_PH",
    images: [
      {
        url: "/landing/filipino-remote-work.png",
        width: 1200,
        height: 630,
        alt: "Filipino freelancer working remotely in the Philippines",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/landing/filipino-remote-work.png"],
  },
  other: {
    "geo.region": "PH",
    "geo.country": "Philippines",
    "country": "Philippines",
    "audience": "Filipino freelancers, virtual assistants, remote workers, employers hiring Filipino talent",
    "topic": "Freelance jobs, remote work, online jobs, virtual assistant work, freelance niches in the Philippines",
  },
};

export default function BestFreelanceNichePhilippinesPage() {
  return (
    <SeoLandingPage
      eyebrow="Freelance Niche Guide"
      title="Best freelance niche in the Philippines"
      subtitle="The best freelance niche depends on your skills, proof of work, communication strength, and the type of clients you want to serve."
      primaryKeyword="best freelance niche Philippines"
      path={path}
      sections={[
        {
          heading: "Popular freelance niches in the Philippines",
          body: "Strong niches include virtual assistance, customer support, social media management, graphic design, web development, content writing, bookkeeping, ecommerce operations, appointment setting, video editing, and workflow automation.",
        },
        {
          heading: "How to choose a profitable niche",
          body: "Pick a niche where you can show proof, solve a specific business problem, and explain your value clearly. A narrow offer like ecommerce product listing support is often easier to sell than a vague general freelancer profile.",
        },
        {
          heading: "How to test your niche on TaraWork",
          body: "Create a public profile with one primary service category, portfolio samples, tools used, deliverables, rate expectations, and a clear description of the client outcome you support.",
        },
      ]}
      faqs={[
        {
          question: "What is the best freelance niche in the Philippines?",
          answer: "There is no single best niche for everyone. Virtual assistance, customer support, design, web development, writing, ecommerce support, bookkeeping, and automation can all work when the freelancer has clear proof and positioning.",
        },
        {
          question: "Should beginners choose a broad or narrow niche?",
          answer: "A focused niche is usually easier to market. Beginners can start broad while learning, then narrow their profile around the tasks and clients where they can show the strongest results.",
        },
        {
          question: "How can TaraWork help with niche positioning?",
          answer: "TaraWork profiles help freelancers organize services, skills, portfolio examples, rates, tools, and work background so employers can quickly understand what they specialize in.",
        },
      ]}
    />
  );
}
