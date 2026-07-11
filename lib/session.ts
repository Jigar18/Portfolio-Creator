import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const SESSION_COOKIE = "id&Uname";

export type Session = {
  userId: string;
  username: string;
};

/**
 * Verifies the application session once at the edge of an API route. Keeping
 * this in one place prevents the routes from accidentally trusting a decoded
 * (but unverified) cookie.
 */
export async function getSession(req: NextRequest): Promise<Session | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const userId = payload.userId;
    const username = payload.username;

    if (typeof userId !== "string" || typeof username !== "string") {
      return null;
    }

    return { userId, username };
  } catch {
    return null;
  }
}
