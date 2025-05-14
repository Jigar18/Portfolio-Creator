import { NextRequest, NextResponse } from "next/server";
import { db, getDbClientInfo } from "@/lib/db";
import { SignJWT } from "jose";

const WEBHOOK_HANDLER_VERSION = "1.0.2";

export async function POST(req: NextRequest) {
  const event = req.headers.get("x-github-event");

  if (event === "installation") {
    try {
      const body = await req.json();
      const installationId = body.installation.id;
      const githubId = body.sender.id;
      const login = body.sender.login;

      const user = await db.user.upsert({
        where: { githubId: githubId.toString() },
        update: { installationId: installationId.toString() },
        create: {
          githubId: githubId.toString(),
          username: login,
          installationId: installationId.toString(),
        },
      });

      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const token = await new SignJWT({
        userId: user.id,
        username: user.username,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(secret);

      const response = new NextResponse("Installation processed successfully", {
        status: 200,
      });

      response.cookies.set("id&Uname", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      return response;
    } catch (error) {
      console.error(`[Webhook ${WEBHOOK_HANDLER_VERSION}] Error:`, error);

      return NextResponse.json(
        {
          error: "Database update failed",
          version: WEBHOOK_HANDLER_VERSION,
          clientInfo: getDbClientInfo(),
          details: {
            message: (error as Error).message,
            name: (error as Error).name,
          },
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    {
      message: "Webhook received",
      version: WEBHOOK_HANDLER_VERSION,
      clientInfo: getDbClientInfo(),
    },
    { status: 200 }
  );
}
