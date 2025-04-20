import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const installation_id = searchParams.get("installation_id");
  if (!code) {
    return NextResponse.json(
      { error: "GitHub OAuth code is missing" },
      { status: 400 }
    );
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
      return NextResponse.json(
        { error: "Failed to obtain access token" },
        { status: 400 }
      );
    }

    if (installation_id) {
      return NextResponse.redirect(
        new URL(`/app-installed?installation_id=${installation_id}`, req.url)
      );
    }

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });

    const user = userResponse.data;

    const token = jwt.sign(
      { githubId: user.id, username: user.login },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    (await cookies()).set("auth_token", token, {
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.redirect(
      new URL(
        `/app-install?access_token=${accessToken}&login=${user.login}`,
        req.url
      )
    );
  } catch (error) {
    console.error("GitHub Auth Error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
