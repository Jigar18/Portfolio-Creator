import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { NextApiResponse } from 'next';

export async function GET(req: NextRequest, res: NextApiResponse) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code'); // Get OAuth `code` from GitHub

  if (!code) {
    return NextResponse.json({ error: 'GitHub OAuth code is missing' }, { status: 400 });
  }

  try {
    // Step 1: Exchange code for a user access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.NEXT_PUBLIC_GITHUB_APP_CLIENT_ID,
        client_secret: process.env.GITHUB_APP_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(400).json({ error: 'Failed to obtain access token' });
    }

    // Step 2: Fetch the user's GitHub App installations
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` },
    });

    const user = userResponse.data;

    // Step 3: Redirect to GitHub App installation
    return res.redirect(`/app-install?access_token=${accessToken}&login=${user.login}`);
  } catch (error) {
    console.error('GitHub Auth Error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
