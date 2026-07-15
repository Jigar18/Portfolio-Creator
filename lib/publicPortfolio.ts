import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function resolvePortfolioUser(request: NextRequest) {
  const requestedUsername = request.nextUrl.searchParams.get("username")?.trim();
  const session = await getSession(request);

  const user = requestedUsername
    ? await db.user.findFirst({
        where: { username: { equals: requestedUsername, mode: "insensitive" } },
        select: { id: true, username: true },
      })
    : session
      ? await db.user.findUnique({
          where: { id: session.userId },
          select: { id: true, username: true },
        })
      : null;

  if (!user) return null;

  return {
    ...user,
    isOwner: session?.userId === user.id,
  };
}

export function portfolioLookupStatus(request: NextRequest) {
  return request.nextUrl.searchParams.has("username") ? 404 : 401;
}
