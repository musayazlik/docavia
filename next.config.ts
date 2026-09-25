import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      // legacy browsers/tools still probe /favicon.ico directly
      { source: "/favicon.ico", destination: "/icon.png" },
    ];
  },
};

export default nextConfig;
