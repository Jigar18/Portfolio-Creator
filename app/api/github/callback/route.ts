import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { SignJWT } from "jose";

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

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ githubId: user.id, username: user.login })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(secret);

    const response = NextResponse.redirect(
      new URL(`/app-install?access_token=${accessToken}&login=${user.login}`, req.url)
    );
    
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/"
    });
    
    return response;
  } catch (error) {
    console.error("GitHub Auth Error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}