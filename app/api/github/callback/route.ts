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
    const token = await new SignJWT({
      githubId: user.id,
      username: user.login,
      // Store the OAuth token in the JWT payload (secure as it's httpOnly)
      oauthToken: accessToken,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret);

    let redirectUrl;

    // Check if we're handling an email permission request
    const returnTo = req.cookies.get("oauth_return_to")?.value;

    if (returnTo && returnTo.includes("emailFetch")) {
      // If this was an email permission request, redirect to a success page
      // instead of directly to the API endpoint to avoid CORS issues
      redirectUrl = new URL(`/email-auth-success`, req.url);
    } else if (installation_id) {
      // Regular app installation flow
      redirectUrl = new URL(
        `/app-installed?installation_id=${installation_id}`,
        req.url
      );
    } else {
      // Standard OAuth flow
      redirectUrl = new URL(
        `/app-install?access_token=${accessToken}&login=${user.login}`,
        req.url
      );
    }

    const response = NextResponse.redirect(redirectUrl);

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
