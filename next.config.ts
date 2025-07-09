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

  // Updated from experimental.serverComponentsExternalPackages
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
