import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

const APP_COOKIES = [
  SESSION_COOKIE,
  "auth_token",
  "github_oauth_state",
  "oauth_return_to",
  "portfolio_visitor_id",
];

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  const cookieNames = new Set([
    ...APP_COOKIES,
    ...request.cookies.getAll().map(({ name }) => name),
  ]);

  cookieNames.forEach((name) => {
    response.cookies.set(name, "", {
      expires: new Date(0),
      maxAge: 0,
      path: "/",
    });
  });
  response.headers.set("Cache-Control", "no-store");

  return response;
}
