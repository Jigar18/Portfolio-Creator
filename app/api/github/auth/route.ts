import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const redirectUri = `${req.nextUrl.origin}/api/github/callback`;

    // Generate random state for security
    const state = Math.random().toString(36).substring(2, 15);

    // Create OAuth URL with user:email scope for email access
    const oauthUrl = new URL("https://github.com/login/oauth/authorize");
    oauthUrl.searchParams.append(
      "client_id",
      process.env.NEXT_PUBLIC_GITHUB_APP_CLIENT_ID!
    );
    oauthUrl.searchParams.append("redirect_uri", redirectUri);
    oauthUrl.searchParams.append("scope", "user:email");
    oauthUrl.searchParams.append("state", state);

    // Set a return_to parameter to know where to redirect after authentication
    const returnTo = req.nextUrl.searchParams.get("return_to") || "/dashboard";

    const response = NextResponse.redirect(oauthUrl);

    // Store the return_to path in a cookie
    response.cookies.set("oauth_return_to", returnTo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error creating OAuth URL:", error);
    return NextResponse.json(
      { error: "Failed to create authorization URL" },
      { status: 500 }
    );
  }
}
