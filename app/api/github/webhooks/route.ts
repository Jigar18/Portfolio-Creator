import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// let prisma: PrismaClient;

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!(global as any).prisma) {
//     (global as any).prisma = new PrismaClient();
//   }
//   prisma = (global as any).prisma;
// }
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV === "production") globalThis.prisma = db;

export async function POST(req: NextRequest) {
  const event = req.headers.get("x-github-event");

  if (event === "installation") {
    try {
      const body = await req.json();
      const installationId = body.installation.id;
      const githubId = body.sender.id;
      const login = body.sender.login;

      // Log the data we're trying to save
      console.log("Processing installation webhook:", {
        installationId,
        githubId,
        login,
      });

      await db.user.upsert({
        where: { githubId: githubId.toString() },
        update: { installationId: installationId.toString() },
        create: {
          githubId: githubId.toString(),
          username: login,
          installationId: installationId.toString(),
        },
      });

      return new NextResponse("Installation processed successfully", {
        status: 200,
      });
    } catch (error) {
      console.error("Error processing webhook:", error);

      // Return more detailed error information
      return NextResponse.json(
        {
          error: "Database update failed",
          details: {
            message: (error as Error).message,
            name: (error as Error).name,
            stack:
              process.env.NODE_ENV === "development"
                ? (error as Error).stack
                : undefined,
          },
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
