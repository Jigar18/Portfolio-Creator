import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query; // Get OAuth `code` from GitHub

  if (!code) {
    return res.status(400).json({ error: 'GitHub OAuth code is missing' });
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

    // Step 2: Fetch the user's GitHub App installations
    const installationsResponse = await axios.get(
      'https://api.github.com/user/installations',
      { headers: { Authorization: `token ${accessToken}` } }
    );

    // Step 3: Get the first installation ID
    const installationId = installationsResponse.data.installations[0]?.id;

    if (!installationId) {
      return res.status(400).json({ error: 'No GitHub App installation found' });
    }

    // Step 4: Redirect to GitHub App installation page
    return res.redirect(`https://github.com/apps/portfolio-creator/installations/${installationId}`);
  } catch (error) {
    console.error('GitHub Auth Error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}
