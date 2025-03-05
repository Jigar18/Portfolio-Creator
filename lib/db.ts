import { PrismaClient } from "@prisma/client";

// Add a deployment version identifier to help with debugging
const DEPLOYMENT_VERSION = "1.0.1";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db =
  globalThis.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

// Store client in global to prevent multiple instances in development
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

// Add a debug method to check the client version
export function getDbClientInfo() {
  return {
    version: DEPLOYMENT_VERSION,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };
}

// Ensure connections are properly closed on process termination
if (process.env.NODE_ENV === "production") {
  process.on("beforeExit", () => {
    db.$disconnect();
  });
}
