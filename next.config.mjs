/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing configuration...

  // Force a full rebuild in production to avoid stale code
  experimental: {
    // ...existing experimental options...

    // Ensure serverComponentsExternalPackages includes prisma
    serverComponentsExternalPackages: ["@prisma/client"],
  },

  // Add a version identifier to ensure deployments are fresh
  env: {
    APP_VERSION: "1.0.3",
    DEPLOYMENT_TIMESTAMP: new Date().toISOString(),
  },
};

export default nextConfig;
