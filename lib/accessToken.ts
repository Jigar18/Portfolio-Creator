import { db } from "@/lib/db";
import axios from "axios";
import { NextRequest } from "next/server";
import { getGitHubAppJwt } from "@/lib/github";
import { getSession } from "@/lib/session";

export async function getInstallationAccessTokenById(installationId: string) {
  const jwtToken = getGitHubAppJwt();

  const tokenResponse = await axios.post(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      timeout: 10_000,
    }
  );

  const accessToken = tokenResponse.data.token as string | undefined;
  if (!accessToken) {
    throw new Error("No access token returned from GitHub API");
  }

  return accessToken;
}

// Function to get installation token for repositories and other GitHub App scopes
// this function access token scope is to get the details that app has of account like repos, pr's etc.,
export async function getInstallationAccessToken(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    throw new Error("Authentication token is missing");
  }

  try {
    const userInfo = await db.user.findUnique({
      where: { id: session.userId },
      select: { installationId: true },
    });

    if (!userInfo || !userInfo.installationId) {
      throw new Error("User installation ID not found");
    }

    return await getInstallationAccessTokenById(userInfo.installationId);
  } catch (error) {
    console.error("Error getting installation access token:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("GitHub API response:", {
        status: error.response.status,
        data: error.response.data,
      });
      throw new Error(
        `GitHub API error: ${error.response.status} - ${error.response.statusText}`
      );
    }
    throw new Error("Failed to get GitHub installation access token");
  }
}


//this function access token is for the scope for fetching details like email or /user things etc.,
// Storing this in the database
export async function getAccessToken(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    throw new Error("Authentication token is missing");
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { accessToken: true },
  });

  if (!user?.accessToken) {
    throw new Error("GitHub OAuth token is missing");
  }

  return user.accessToken;
}
