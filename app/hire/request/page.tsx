import type { Metadata } from "next";
import TalentRequestForm from "@/components/TalentRequestForm";
import { absoluteUrl, collaborationOgImage, siteName } from "@/lib/seo";

const title = "Get a Free Filipino Talent Shortlist";
const description =
  "Tell TaraWork who you need and get help shortlisting Filipino freelancers, virtual assistants, developers, designers, support specialists, and remote talent.";
const path = "/hire/request";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "get Filipino talent shortlist",
    "hire Filipino freelancers",
    "hire online Filipino talent",
    "Filipino freelancers hiring service",
    "hire virtual assistant Philippines",
    "find Filipino remote workers",
    "Filipino talent matching",
    "remote hiring Philippines",
  ],
  alternates: { canonical: absoluteUrl(path) },
  openGraph: {
    type: "website",
    url: absoluteUrl(path),
    siteName,
    title,
    description,
    locale: "en_PH",
    images: [collaborationOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [collaborationOgImage.url],
  },
};

export default function HireRequestPage() {
  return <TalentRequestForm />;
}
