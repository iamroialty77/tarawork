import type { Metadata } from "next";
import HomeEntry from "@/components/HomeEntry";
import { getSiteSettings } from "@/lib/siteSettings";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettingsShared";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const title = settings.seoTitle || DEFAULT_SITE_SETTINGS.seoTitle;
  const description = settings.seoDescription || DEFAULT_SITE_SETTINGS.seoDescription;
  const canonical = settings.canonicalUrl || DEFAULT_SITE_SETTINGS.canonicalUrl;
  const ogTitle = settings.ogTitle || title;
  const ogDescription = settings.ogDescription || description;
  const image = settings.ogImageUrl || DEFAULT_SITE_SETTINGS.ogImageUrl;

  return {
    title: { absolute: title },
    description,
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

export default function Home() {
  return <HomeEntry />;
}
