import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import axios from "axios";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Function to get installation token for repositories and other GitHub App scopes
export async function getInstallationAccessToken(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    throw new Error("Authentication token is missing");
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const githubId = payload.githubId as string;

    if (!githubId) {
      throw new Error("GitHub ID not found in token payload");
    }

    const userInfo = await db.user.findUnique({
      where: { githubId: String(githubId) },
      select: { installationId: true },
    });

    if (!userInfo || !userInfo.installationId) {
      throw new Error("User installation ID not found");
    }

    const payloadCreate = {
      iss: process.env.GITHUB_APP_ID,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    };

    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY!;

    if (!privateKey) {
      throw new Error("GitHub app private key is missing");
    }

    const jwtToken = jwt.sign(payloadCreate, privateKey, {
      algorithm: "RS256",
    });

    const tokenResponse = await axios.post(
      `https://api.github.com/app/installations/${userInfo.installationId}/access_tokens`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
      }
    );

    const accessToken = tokenResponse.data.token;

    if (!accessToken) {
      throw new Error("No access token returned from GitHub API");
    }

    return accessToken;
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

// Function to create a new authentication token for user-specific operations
export async function getAccessToken(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    // Check if we have the token in the JWT first
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );

      // If we have an OAuth token in the JWT payload, use it
      if (payload.oauthToken) {
        return payload.oauthToken as string;
      }
    } catch (jwtError) {
      console.warn("JWT token doesn't contain OAuth token or is invalid");
    }

    // Check for code parameter
    const code = req.url.split("code=")[1]?.split("&")[0];

    if (code) {
      // Exchange the code for an access token with user:email scope
      const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.NEXT_PUBLIC_GITHUB_APP_CLIENT_ID,
          client_secret: process.env.GITHUB_APP_CLIENT_SECRET,
          code,
          scope: "user:email",
        },
        { headers: { Accept: "application/json" } }
      );

      const accessToken = tokenResponse.data.access_token;
      if (accessToken) {
        return accessToken;
      }
    }

    // Fall back to installation token if no OAuth token is available
    return getInstallationAccessToken(req);
  } catch (error) {
    console.error("Error getting user access token:", error);
    return getInstallationAccessToken(req);
  }
}
