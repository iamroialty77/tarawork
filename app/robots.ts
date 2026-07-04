import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/jobs/", "/p/"],
      disallow: [
        "/api/",
        "/admin/",
        "/auth/",
        "/dashboard/",
        "/messages/",
        "/trello/",
        "/_next/",
        "/*?*",
        "/*/callback",
        "/*/webhooks",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
