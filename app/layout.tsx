import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { absoluteUrl, defaultOgImage, defaultSeoDescription, seoKeywords, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: siteName,
      alternateName: ["TaraWork.online", "Tara Work", "Tara Work online", "tare work", "tarabjo"],
      url: absoluteUrl("/"),
      logo: absoluteUrl("/tarawork-removebg-preview.png"),
      email: "hello@tarawork.online",
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@tarawork.online",
        contactType: "customer support",
        availableLanguage: ["English", "Filipino"],
      },
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: "TaraWork.online",
      alternateName: ["TaraWork", "Tara Work", "Tara Work online", "tare work", "tarabjo"],
      url: absoluteUrl("/"),
      publisher: {
        "@id": absoluteUrl("/#organization"),
      },
      inLanguage: "en-PH",
      potentialAction: {
        "@type": "SearchAction",
        target: `${absoluteUrl("/")}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Service",
      "@id": absoluteUrl("/#freelance-marketplace"),
      name: "Filipino freelance marketplace and virtual assistant hiring",
      serviceType: "Freelance hiring marketplace",
      provider: {
        "@id": absoluteUrl("/#organization"),
      },
      areaServed: [
        {
          "@type": "Country",
          name: "Philippines",
        },
        {
          "@type": "Place",
          name: "Worldwide remote clients",
        },
      ],
      audience: [
        {
          "@type": "Audience",
          audienceType: "Employers hiring remote Filipino freelancers",
        },
        {
          "@type": "Audience",
          audienceType: "Freelancers and virtual assistants in the Philippines",
        },
      ],
      description: defaultSeoDescription,
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        url: absoluteUrl("/"),
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "Tara Work | Remote Jobs and Freelancing Platform in the Philippines",
    template: `%s | ${siteName}`,
  },
  description: defaultSeoDescription,
  keywords: seoKeywords,
  authors: [{ name: "TaraWork" }],
  creator: "TaraWork",
  publisher: "TaraWork",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: absoluteUrl("/"),
    siteName,
    title: "Tara Work | Remote Jobs and Freelancing Platform in the Philippines",
    description: defaultSeoDescription,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tara Work | Remote Jobs and Freelancing Platform in the Philippines",
    description: defaultSeoDescription,
    images: [defaultOgImage.url],
  },
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
  icons: {
    icon: "/tarawork-removebg-preview.png",
    apple: "/tarawork-removebg-preview.png",
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
