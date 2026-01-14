import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    // Allow unoptimized images for external sources
    unoptimized: process.env.NODE_ENV === 'development',
  },
  async redirects() {
    return [
      {
        source: "/reset-password",
        destination: "/auth/reset-password",
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
