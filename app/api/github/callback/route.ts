import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { SignJWT } from "jose";
import { db } from "@/lib/db";

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

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });

    const user = userResponse.data;

    const userDB = await db.user.upsert({
      where: { githubId: user.id.toString() },
      update: { accessToken },
      create: {
        githubId: user.id.toString(),
        username: user.login,
        accessToken,
      },
    });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const tokenDB = await new SignJWT({
        userId: userDB.id.toString(),
        username: userDB.username,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(secret);


    const token = await new SignJWT({
      githubId: user.id,
      username: user.login,
      oauthToken: accessToken,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret);

    let redirectUrl;

    const returnTo = req.cookies.get("oauth_return_to")?.value;

    if (installation_id) {
      redirectUrl = new URL(
        `/app-installed?installation_id=${installation_id}`,
        req.url
      );
    } else {
      redirectUrl = new URL(
        `/app-install?access_token=${accessToken}&login=${user.login}`,
        req.url
      );
    }

    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set("id&Uname", tokenDB, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    // Clear the oauth_return_to cookie
    if (returnTo) {
      response.cookies.set("oauth_return_to", "", {
        expires: new Date(0),
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("GitHub Auth Error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
