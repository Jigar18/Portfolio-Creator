import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

const COOKIES_TO_CLEAR = [
  SESSION_COOKIE,
  "auth_token",
  "github_oauth_state",
  "oauth_return_to",
];

export async function POST() {
  const response = new NextResponse(null, { status: 204 });

  for (const name of COOKIES_TO_CLEAR) {
    response.cookies.set(name, "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}
