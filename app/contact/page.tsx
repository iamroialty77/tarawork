import type { Metadata } from "next";
import PublicInfoPage from "@/components/PublicInfoPage";
export const metadata: Metadata = { title: "Contact TaraWork", description: "Official contact and support information for TaraWork." };
export default function ContactPage() { return <PublicInfoPage eyebrow="Support" title="Contact TaraWork" introduction="Use TaraWork's official domain email for account support, safety reports, privacy requests, partnerships, and platform questions." sections={[
  { heading: "General and account support", paragraphs: ["Email hello@tarawork.online. Include your account email, the relevant profile or job link, and enough detail to investigate. Never email passwords, one-time codes, full card numbers, or unnecessary identity documents."] },
  { heading: "Safety reports", paragraphs: ["For a suspicious job, user, or payment request, include screenshots, dates, URLs, and the communication channel used. Mark urgent account-compromise reports clearly in the subject line."] },
  { heading: "Privacy and legal requests", paragraphs: ["Use hello@tarawork.online for access, correction, deletion, legal, or intellectual-property requests. TaraWork may ask for reasonable verification before acting on an account or data request."] },
  { heading: "Official communication", paragraphs: ["Treat messages claiming to represent TaraWork with caution if they do not come from an official @tarawork.online address. TaraWork will never ask for your password or one-time authentication code by email."] },
]} />; }
