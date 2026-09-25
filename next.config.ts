import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      // UploadThing CDN — uploaded doctor portraits, avatars, covers.
      { protocol: "https", hostname: "*.utfs.io" },
      { protocol: "https", hostname: "*.ufs.sh" },
    ],
  },
  async rewrites() {
    return [
      // legacy browsers/tools still probe /favicon.ico directly
      { source: "/favicon.ico", destination: "/icon.png" },
    ];
  },
};

export default nextConfig;
