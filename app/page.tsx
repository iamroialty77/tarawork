import type { Metadata } from "next";
import { cache } from "react";
import HomeEntry from "@/components/HomeEntry";
import { getSiteSettings } from "@/lib/siteSettings";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettingsShared";
import { landingFaqs } from "@/lib/landingSeoContent";
import { createJobShareToken } from "@/lib/jobShare";
import { supabaseAdmin } from "@/lib/supabase_admin";

// Site settings are editable in the admin panel and stored in Supabase. Rendering
// this page at request time avoids making a temporary database/configuration issue
// fail the entire production build and ensures published changes appear immediately.
export const dynamic = "force-dynamic";

const getLandingSettings = cache(() => getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS));
const getLandingDirectory = cache(async () => {
  const [{ data: jobs }, { data: profiles }] = await Promise.all([
    supabaseAdmin.from("jobs").select("id,title,category,rate,duration,created_at")
      .eq("status", "live").order("created_at", { ascending: false }).limit(6),
    supabaseAdmin.from("profiles").select("id,username,name,category,bio,skills,avatar_url,hourlyRate")
      .eq("role", "freelancer").order("updated_at", { ascending: false }).limit(6),
  ]);
  return {
    jobs: (jobs || []).filter((job) => job.id && job.title).map((job) => ({
      id: String(job.id),
      title: String(job.title),
      category: String(job.category || "Remote Work"),
      rate: String(job.rate || "Rate discussed with employer"),
      duration: String(job.duration || "Flexible"),
      href: `/jobs/${createJobShareToken({ id: String(job.id), title: String(job.title) })}`,
    })),
    freelancers: (profiles || []).filter((profile) => profile.id && profile.name).map((profile) => ({
      id: String(profile.id),
      name: String(profile.name),
      category: String(profile.category || "Remote Professional"),
      bio: String(profile.bio || "View this professional profile to learn more about their skills and services."),
      skills: Array.isArray(profile.skills) ? profile.skills.map(String).slice(0, 3) : [],
      avatarUrl: String(profile.avatar_url || ""),
      hourlyRate: String(profile.hourlyRate || ""),
      href: `/${encodeURIComponent(String(profile.username || profile.id))}`,
    })),
  };
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getLandingSettings();
  const title = settings.seoTitle || DEFAULT_SITE_SETTINGS.seoTitle;
  const description = settings.seoDescription || DEFAULT_SITE_SETTINGS.seoDescription;
  const canonical = settings.canonicalUrl || DEFAULT_SITE_SETTINGS.canonicalUrl;
  const ogTitle = settings.ogTitle || title;
  const ogDescription = settings.ogDescription || description;
  const image = settings.ogImageUrl || DEFAULT_SITE_SETTINGS.ogImageUrl;

  return {
    title: { absolute: title },
    description,
    keywords: settings.seoKeywords,
    verification: settings.googleSiteVerification || settings.bingSiteVerification ? {
      google: settings.googleSiteVerification || undefined,
      other: settings.bingSiteVerification ? { "msvalidate.01": [settings.bingSiteVerification] } : undefined,
    } : undefined,
    alternates: { canonical },
    robots: {
      index: settings.searchIndexing,
      follow: settings.searchIndexing,
      googleBot: { index: settings.searchIndexing, follow: settings.searchIndexing },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: ogTitle,
      description: ogDescription,
      images: [{ url: image, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: settings.twitterCardType,
      title: ogTitle,
      description: ogDescription,
      images: [image],
    },
  };
}

export default async function Home() {
  const settings = await getLandingSettings();
  const directory = await getLandingDirectory().catch(() => ({ jobs: [], freelancers: [] }));
  const canonical = settings.canonicalUrl || DEFAULT_SITE_SETTINGS.canonicalUrl;
  const socialProfiles = [
    settings.facebookUrl,
    settings.linkedinUrl,
    settings.instagramUrl,
    settings.youtubeUrl,
    settings.xUrl,
  ].filter(Boolean);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: settings.seoTitle,
        description: settings.seoDescription,
        isPartOf: { "@id": `${canonical}#website` },
        about: { "@id": `${canonical}#organization` },
        primaryImageOfPage: settings.ogImageUrl
          ? { "@type": "ImageObject", url: new URL(settings.ogImageUrl, canonical).toString() }
          : undefined,
        inLanguage: "en-PH",
      },
      {
        "@type": "Organization",
        "@id": `${canonical}#organization`,
        name: "TaraWork",
        url: canonical,
        email: settings.contactEmail || undefined,
        telephone: settings.contactPhone || undefined,
        address: settings.address
          ? { "@type": "PostalAddress", streetAddress: settings.address, addressCountry: "PH" }
          : undefined,
        sameAs: socialProfiles,
      },
      {
        "@type": "FAQPage",
        mainEntity: landingFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
  return <>
    {settings.googleSiteVerification && <meta name="google-site-verification" content={settings.googleSiteVerification} />}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
    />
    <HomeEntry landingJobs={directory.jobs} landingFreelancers={directory.freelancers} />
  </>;
}
