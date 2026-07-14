import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.fashn.ai" },
      { protocol: "https", hostname: "api.fashn.ai" },
      { protocol: "https", hostname: "app.fashn.ai" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "v3.fal.media" },
      { protocol: "https", hostname: "mjc1kvq4a1.ufs.sh" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: [] },
  },
};

export default nextConfig;
