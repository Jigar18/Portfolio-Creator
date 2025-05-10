import { getAccessToken } from "@/lib/accessToken";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const accessToken = await getAccessToken(req);

    // Try to fetch user emails
    let userEmailsResponse;
    try {
      userEmailsResponse = await axios.get(
        "https://api.github.com/user/emails",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
    } catch (emailError) {
      // If we got a 403 (forbidden), we need to send back auth URL
      if (
        axios.isAxiosError(emailError) &&
        emailError.response?.status === 403
      ) {
        // Instead of redirecting, return a JSON response with auth URL
        const authUrl = new URL(
          `/api/github/auth?return_to=/api/emailFetch`,
          req.url
        ).toString();
        return NextResponse.json(
          {
            error: "Email permission required",
            authUrl: authUrl,
            needsAuth: true,
          },
          { status: 401 }
        );
      }
      // If it's another error, re-throw
      throw emailError;
    }

    interface GithubEmail {
      email: string;
      primary: boolean;
      verified: boolean;
      visibility: string | null;
    }

    console.log(
      "GitHub email response data:",
      JSON.stringify(userEmailsResponse.data)
    );

    if (!Array.isArray(userEmailsResponse.data)) {
      return NextResponse.json(
        { error: "Unexpected response format from GitHub API" },
        { status: 500 }
      );
    }

    const primaryEmail = userEmailsResponse.data.find(
      (emailObj: GithubEmail) => emailObj.primary
    )?.email;

    if (!primaryEmail) {
      // Try to get any verified email if primary is not found
      const verifiedEmail = userEmailsResponse.data.find(
        (emailObj: GithubEmail) => emailObj.verified
      )?.email;

      if (verifiedEmail) {
        return NextResponse.json({ email: verifiedEmail });
      }

      return NextResponse.json(
        { error: "No primary email found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ email: primaryEmail });
  } catch (err: unknown) {
    console.error("  error:", err);

    if (axios.isAxiosError(err)) {
      // GitHub API error
      if (err.response) {
        return NextResponse.json(
          {
            error: `GitHub API error: ${err.response.status} - ${err.response.statusText}`,
          },
          { status: err.response.status }
        );
      }
    }

    // Authentication error
    if (
      err instanceof Error &&
      err.message.includes("Authentication token is missing")
    ) {
      return NextResponse.json(
        { error: "Authentication token is missing" },
        { status: 401 }
      );
    }

    if (
      err instanceof Error &&
      err.message.includes("User installation ID not found")
    ) {
      return NextResponse.json(
        { error: "GitHub app installation not found" },
        { status: 404 }
      );
    }

    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
