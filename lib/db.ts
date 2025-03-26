import { PrismaClient } from "@prisma/client";

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

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

export function getDbClientInfo() {
  return {
    version: DEPLOYMENT_VERSION,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };
}

if (process.env.NODE_ENV === "production") {
  process.on("beforeExit", () => {
    db.$disconnect();
  });
}
