"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const fallbackMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-SM4S8WR346";
const fallbackGtmId = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID || "";

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
  const [measurementId, setMeasurementId] = useState(fallbackMeasurementId);
  const [gtmId, setGtmId] = useState(fallbackGtmId);

  useEffect(() => {
    fetch("/api/site-settings", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (/^G-[A-Z0-9]+$/i.test(payload?.settings?.gaMeasurementId || "")) {
          setMeasurementId(payload.settings.gaMeasurementId);
        }
        if (/^GTM-[A-Z0-9]+$/i.test(payload?.settings?.gtmContainerId || "")) {
          setGtmId(payload.settings.gtmContainerId);
        }
      })
      .catch(() => null);
  }, []);

  if (!measurementId) return null;

  return (
    <>
      {gtmId ? <>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
        <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" /></noscript>
      </> : null}
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
