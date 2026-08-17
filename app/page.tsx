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
    supabaseAdmin.from("jobs").select("id,title,category,rate,duration,createdAt")
      .eq("status", "live").order("createdAt", { ascending: false }).limit(3),
    supabaseAdmin.from("profiles").select("id,username,name,category,bio,skills,avatar_url,hourlyRate,aiInsights,status")
      .eq("role", "freelancer").order("updated_at", { ascending: false }).limit(50),
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
    freelancers: (profiles || []).map((profile) => {
      const insights = profile.aiInsights && typeof profile.aiInsights === "object"
        ? profile.aiInsights as Record<string, unknown> : {};
      const about = insights.aboutSections && typeof insights.aboutSections === "object"
        ? insights.aboutSections as Record<string, unknown> : {};
      const bio = String(profile.bio || Object.values(about).filter((value) => typeof value === "string" && value.trim()).join(" "));
      const skills = Array.isArray(profile.skills) ? profile.skills.map(String).map((skill) => skill.trim()).filter(Boolean) : [];
      const services = Array.isArray(insights.servicesOffered)
        ? insights.servicesOffered.map((service) => service && typeof service === "object"
          ? String((service as Record<string, unknown>).serviceName || "").trim() : "").filter(Boolean)
        : [];
      const hourlyRate = String(profile.hourlyRate || "").trim();
      const rateValue = Number.parseFloat(hourlyRate.replace(/[^0-9.]/g, ""));
      return {
        id: String(profile.id || ""),
        name: String(profile.name || "").trim(),
        category: String(profile.category || "").trim(),
        bio,
        skills,
        services,
        avatarUrl: String(profile.avatar_url || "").trim(),
        hourlyRate,
        rateValue,
        status: String(profile.status || "").toLowerCase(),
        href: `/${encodeURIComponent(String(profile.username || profile.id))}`,
      };
    }).filter((profile) =>
      profile.id &&
      profile.name &&
      profile.category &&
      profile.avatarUrl &&
      profile.bio.trim().length >= 60 &&
      profile.skills.length >= 2 &&
      profile.services.length >= 1 &&
      Number.isFinite(profile.rateValue) &&
      profile.rateValue > 0 &&
      profile.status !== "suspended"
    ).sort((a, b) => Number(b.status === "verified") - Number(a.status === "verified"))
      .slice(0, 3).map((profile) => ({
      id: profile.id,
      name: profile.name,
      category: profile.category,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      hourlyRate: profile.hourlyRate,
      href: profile.href,
      skills: profile.skills.slice(0, 4),
      services: profile.services.slice(0, 2),
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
