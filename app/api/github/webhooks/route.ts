import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const event = req.headers.get('x-github-event');

    if (event === 'installation') {
      const body = await req.json();
      console.log('New GitHub App Installation:', body.installation.id);
    }

    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}


// import {PrismaClient} from "@prisma/client";

// const prisma = new PrismaClient({
//   log: ['query'],
// });

// export async function saveInstallation(userId: string, installationId: string) {

// }


// export default prisma;