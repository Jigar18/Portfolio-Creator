import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const installationId = process.env.GITHUB_APP_INSTALLATION_ID; // Fetch from DB in production

  if (!installationId) {
    return res.status(400).json({ error: 'Installation ID is missing' });
  }

  try {
    // Step 1: Generate installation access token
    const tokenResponse = await axios.post(
      `https://api.github.com/app/installations/${installationId}/access_tokens`,
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_APP_JWT}`, // JWT token for authentication
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const accessToken = tokenResponse.data.token;

    // Step 2: Fetch repositories
    const reposResponse = await axios.get(`https://api.github.com/installation/repositories`, {
      headers: { Authorization: `token ${accessToken}` },
    });

    return res.status(200).json(reposResponse.data.repositories);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return res.status(500).json({ error: 'Failed to fetch repositories' });
  }
}
