"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-SM4S8WR346";

function GoogleAnalyticsPageViews({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window.gtag) return;

    const queryString = searchParams.toString();
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;

    window.gtag("config", gaId, {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [gaId, pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsPageViews gaId={measurementId} />
      </Suspense>
    </>
  );
}
