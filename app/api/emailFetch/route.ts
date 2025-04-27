import { getAccessToken } from "@/lib/accessToken";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const accessToken = await getAccessToken(req);

    const userEmailsResponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    interface GithubEmail {
      email: string;
      primary: boolean;
      verified: boolean;
      visibility: string | null;
    }

    const primaryEmail = userEmailsResponse.data.find(
      (emailObj: GithubEmail) => emailObj.primary
    )?.email;

    if (!primaryEmail) {
      return NextResponse.json(
        { error: "No primary email found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ email: primaryEmail });
  } catch (err: unknown) {
    console.error("Email fetch error:", err);

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
