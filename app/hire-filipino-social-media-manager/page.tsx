import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";
import { absoluteUrl, collaborationOgImage, siteName } from "@/lib/seo";

const title = "Hire a Filipino Social Media Manager";
const description =
  "Hire Filipino social media managers for content calendars, captions, community management, scheduling, reporting, short-form content, and brand support.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/hire-filipino-social-media-manager") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/hire-filipino-social-media-manager"),
    siteName,
    title,
    description,
    images: [collaborationOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [collaborationOgImage.url],
  },
};

export default function HireFilipinoSocialMediaManagerPage() {
  return (
    <SeoLandingPage
      eyebrow="Filipino Social Media Managers"
      title="Hire a Filipino social media manager for remote content and community support"
      subtitle="Find Filipino social media specialists for content planning, captions, scheduling, community replies, short-form content support, analytics, and campaign coordination."
      primaryKeyword="hire Filipino social media manager"
      path="/hire-filipino-social-media-manager"
      sections={[
        {
          heading: "Social media tasks you can delegate",
          body: "A Filipino social media manager can help create content calendars, draft captions, schedule posts, organize assets, respond to comments, track engagement, coordinate campaigns, repurpose content, and prepare basic performance reports. The right hire can help keep your brand consistent while freeing your team from daily publishing tasks.",
        },
        {
          heading: "What to look for in a profile",
          body: "Review platform experience, writing samples, design tool familiarity, industry background, reporting habits, and examples of previous content work. A strong profile should explain whether the specialist focuses on strategy, execution, community management, analytics, or a combination of these responsibilities.",
        },
        {
          heading: "Set expectations before hiring",
          body: "Before hiring, define posting frequency, approval workflow, brand voice, asset sources, target audience, platforms, response rules, and reporting cadence. Clear expectations make remote collaboration smoother and help the freelancer deliver consistent work.",
        },
      ]}
      faqs={[
        {
          question: "Can I hire a Filipino social media manager remotely?",
          answer: "Yes. TaraWork helps employers post remote social media roles and connect with Filipino freelancers who can support planning, publishing, engagement, and reporting.",
        },
        {
          question: "What platforms can a social media manager support?",
          answer: "Common platforms include Facebook, Instagram, LinkedIn, TikTok, YouTube Shorts, X, Pinterest, and ecommerce social channels depending on the freelancer's experience.",
        },
        {
          question: "Should I provide brand guidelines?",
          answer: "Yes. Brand guidelines, sample posts, audience details, offer information, and approval rules help a remote social media manager produce better and more consistent work.",
        },
      ]}
    />
  );
}
