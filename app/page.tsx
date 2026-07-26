import type { Metadata } from "next";
import { cache } from "react";
import HomeEntry from "@/components/HomeEntry";
import { getSiteSettings } from "@/lib/siteSettings";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettingsShared";

// Site settings are editable in the admin panel and stored in Supabase. Rendering
// this page at request time avoids making a temporary database/configuration issue
// fail the entire production build and ensures published changes appear immediately.
export const dynamic = "force-dynamic";

const getLandingSettings = cache(() => getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS));

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
    verification: settings.googleSiteVerification ? { google: settings.googleSiteVerification } : undefined,
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
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [image],
    },
  };
}

export default async function Home() {
  const settings = await getLandingSettings();
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
    ],
  };
  return <>
    {settings.googleSiteVerification && <meta name="google-site-verification" content={settings.googleSiteVerification} />}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
    />
    <HomeEntry />
  </>;
}
