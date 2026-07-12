import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";
import { absoluteUrl, siteName } from "@/lib/seo";

const title = "Hire a Virtual Assistant in the Philippines";
const description =
  "Find virtual assistants in the Philippines for admin support, customer service, ecommerce, social media, lead generation, scheduling, and remote operations.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/virtual-assistant-philippines") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/virtual-assistant-philippines"),
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

export default function VirtualAssistantPhilippinesPage() {
  return (
    <SeoLandingPage
      eyebrow="Virtual Assistant Philippines"
      title="Hire a virtual assistant in the Philippines for remote business support"
      subtitle="TaraWork connects businesses with Filipino virtual assistants for administrative work, inbox management, customer support, ecommerce tasks, scheduling, research, social media, and daily operations."
      primaryKeyword="virtual assistant Philippines"
      path="/virtual-assistant-philippines"
      sections={[
        {
          heading: "What a Filipino virtual assistant can help with",
          body: "A virtual assistant in the Philippines can support inbox management, calendar scheduling, customer replies, data entry, CRM updates, lead research, ecommerce product updates, social media coordination, file organization, reporting, and recurring administrative tasks that keep a business moving.",
        },
        {
          heading: "How to choose the right VA",
          body: "Look for a profile that explains communication style, availability, tools used, service scope, previous work, and industry experience. TaraWork gives employers a structured way to compare profiles and contact assistants who match the work needed.",
        },
        {
          heading: "Remote hiring with clearer expectations",
          body: "Good remote hiring starts with a clear role description, required tools, weekly workload, compensation, and success expectations. Public TaraWork job pages help employers communicate these details before candidates apply.",
        },
      ]}
      faqs={[
        {
          question: "How do I hire a virtual assistant from the Philippines?",
          answer: "Post a clear role on TaraWork, describe the tasks and schedule, review matching profiles, compare experience, and start a hiring conversation with candidates who fit your workflow.",
        },
        {
          question: "What tasks can a Philippine virtual assistant do?",
          answer: "Common tasks include admin support, customer service, email management, appointment scheduling, ecommerce support, research, lead generation, social media coordination, and data entry.",
        },
        {
          question: "Is TaraWork only for virtual assistants?",
          answer: "No. TaraWork also supports freelancers in development, design, writing, marketing, support, finance, ecommerce, operations, and project management.",
        },
      ]}
    />
  );
}
