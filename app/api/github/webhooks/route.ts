import { NextRequest, NextResponse } from 'next/server';

import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query'],
});

export async function POST(req: NextRequest) {
  const event = req.headers.get('x-github-event');

  if (event === 'installation') { 
    const body = await req.json();
    const installationId = body.installation.id;
    const githubId = body.sender.id;

    try {
      await prisma.user.upsert({
        where: { githubId: githubId.toString() },
        update: { installationId: installationId.toString() },
        create: { 
          githubId: githubId.toString(), 
          installationId: installationId.toString(),
          username: body.sender.login
        },
      });

      return new NextResponse('OK', { status: 200 });
    }
    catch (error) {
      console.error("Error saving installation ID:", error);
      return new Response(JSON.stringify({ error: "Database update failed" }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ message: "Webhook received" }), { status: 200 });
}