import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event = req.headers['x-github-event'];

  if (event === 'installation') {
    const { installation } = req.body;
    console.log('New GitHub App Installation:', installation.id);

    // Save the installation ID in the database (for future API calls)
  }

  res.status(200).json({ message: 'Webhook received' });
}
