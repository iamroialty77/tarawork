import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/work-from-home-2026",
        destination: "/top-remote-jobs-for-filipinos-2026",
        permanent: true,
      },
      {
        source: "/project-base-work",
        destination: "/hire-filipino-freelancers",
        permanent: true,
      },
      {
        source: "/hello-world",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536],
    imageSizes: [96, 160, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.canva.com",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/uc",
      },
    ],
  },
};

export default nextConfig;
