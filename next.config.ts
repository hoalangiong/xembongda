import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/bongda",
  images: {
    remotePatterns: [
      { hostname: "media.api-sports.io" },
      { hostname: "flagcdn.com" },
      { hostname: "sportsrc.org" },
    ],
  },
};

export default nextConfig;
