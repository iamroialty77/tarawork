import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";
import { absoluteUrl, siteName } from "@/lib/seo";

const title = "Flexible Remote Jobs for Filipino Students";
const description =
  "Find flexible remote job ideas for Filipino students, including virtual assistant tasks, writing, design, social media, data entry, and online support work.";
const path = "/flexible-remote-jobs-for-filipino-students";

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

export default function FlexibleRemoteJobsForFilipinoStudentsPage() {
  return (
    <SeoLandingPage
      eyebrow="Student Remote Work"
      title="Flexible remote jobs for Filipino students"
      subtitle="Students can start with remote work that fits around class schedules, builds a portfolio, and develops client communication skills."
      primaryKeyword="flexible remote jobs for Filipino students"
      path={path}
      sections={[
        {
          heading: "Good remote work options for students",
          body: "Flexible roles can include data entry, social media scheduling, basic graphic design, content writing, research, email support, chat support, virtual assistant tasks, transcript cleanup, and ecommerce listing support.",
        },
        {
          heading: "How students can present themselves professionally",
          body: "A student profile should clearly show availability, skills, tools, sample work, communication style, and the type of work they can reliably deliver. Employers need clarity more than long experience.",
        },
        {
          heading: "How to balance remote work and school",
          body: "Choose roles with predictable hours, define your weekly capacity, avoid overpromising, and communicate deadlines early. Small recurring tasks are often easier to manage than urgent full-time workloads.",
        },
      ]}
      faqs={[
        {
          question: "Can Filipino students do remote freelance work?",
          answer: "Yes, if they choose roles that match their schedule and skill level. They should be clear about availability, deadlines, and the type of work they can complete consistently.",
        },
        {
          question: "What beginner-friendly remote jobs can students try?",
          answer: "Beginner-friendly options include data entry, research, basic admin support, content assistance, social media scheduling, chat support, and simple design tasks.",
        },
        {
          question: "How can students get noticed by clients?",
          answer: "Students should create a focused profile with sample work, clear service offers, tools they know, weekly availability, and a professional explanation of how they help clients.",
        },
      ]}
    />
  );
}
