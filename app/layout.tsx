import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { absoluteUrl, defaultSeoDescription, seoKeywords, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "TaraWork | Filipino Freelancers and Virtual Assistants",
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
    title: "TaraWork | Filipino Freelancers and Virtual Assistants",
    description: defaultSeoDescription,
    images: [
      {
        url: "/tarawork-removebg-preview.png",
        width: 1200,
        height: 630,
        alt: "TaraWork",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TaraWork | Filipino Freelancers and Virtual Assistants",
    description: defaultSeoDescription,
    images: ["/tarawork-removebg-preview.png"],
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
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
