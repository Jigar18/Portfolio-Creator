import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const installationId = process.env.GITHUB_APP_INSTALLATION_ID;  // Ftch from the user

  if (!installationId) {
    return NextResponse.json(
      { error: "Installation ID is missing" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Generate installation access token
    const tokenResponse = await axios.post(
      `https://api.github.com/app/installations/${installationId}/access_tokens`,
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_APP_JWT}`,
          Accept: "application/vnd.github.v3+json",
          'Content-Type': 'application/json',
        },
      }
    );

    const accessToken = tokenResponse.data.token;

    // Step 2: Fetch repositoriesF
    const reposResponse = await axios.get(
      `https://api.github.com/installation/repositories`,
      {
        headers: { Authorization: `token ${accessToken}` },
      }
    );

    return NextResponse.json(reposResponse.data.repositories);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
