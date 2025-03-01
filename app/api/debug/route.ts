import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    clientId: process.env.NEXT_PUBLIC_GITHUB_APP_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI,
    // Don't include secrets in production!
    // clientSecret: process.env.GITHUB_APP_CLIENT_SECRET 
  });
} 