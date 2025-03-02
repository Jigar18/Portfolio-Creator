import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const installation_id = searchParams.get("installation_id");
  if (!code) {
    return NextResponse.json({ error: "GitHub OAuth code is missing" }, { status: 400 });
  }

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.NEXT_PUBLIC_GITHUB_APP_CLIENT_ID,
        client_secret: process.env.GITHUB_APP_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return NextResponse.json({ error: "Failed to obtain access token" }, { status: 400 });
    }

    if (installation_id) {
      return NextResponse.redirect(new URL(`/app-installed?installation_id=${installation_id}`, req.url));
    }

    // Step 3: Fetch GitHub user info (OAuth flow)
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });

    const user = userResponse.data;

    return NextResponse.redirect(new URL(`/app-install?access_token=${accessToken}&login=${user.login}`, req.url));
  } catch (error) {
    console.error("GitHub Auth Error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
