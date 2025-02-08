import { NextRequest, NextResponse } from "next/server";
import { App } from "octokit";

// Load environment variables
const appId = process.env.APP_ID!;
const webhookSecret = process.env.WEBHOOK_SECRET!;
const privateKey = process.env.PRIVATE_KEY!;

// Initialize GitHub App instance
const app = new App({
  appId,
  privateKey,
  webhooks: { secret: webhookSecret },
});

// Function to get repositories from GitHub
async function getUserRepositories(installationId: number) {
  const octokit = await app.getInstallationOctokit(installationId);

  try {
    // Fetch repositories of the authenticated user
    const response = await octokit.request("GET /installation/repositories", {
      headers: { "x-github-api-version": "2022-11-28" },
    });

    // Extract and format repository details
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const repositories = response.data.repositories.map((repo: any) => ({
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description || "No description provided",
      language: repo.language || "Not specified",
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      visibility: repo.private ? "Private" : "Public",
    }));

    return repositories;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return null;
  }
}

// API route handler
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Ensure the event is related to an installation (e.g., user installs the app)
    if (payload.installation?.id) {
      const repositories = await getUserRepositories(payload.installation.id);

      if (!repositories) {
        return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
      }

      return NextResponse.json({ repositories });
    }

    return NextResponse.json({ message: "No installation ID found" }, { status: 400 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
