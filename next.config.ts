import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xspywcumjzcpwltlhxyi.supabase.co",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
