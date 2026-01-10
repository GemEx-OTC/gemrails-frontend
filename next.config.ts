import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
