import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/session";

function isPublicPage(pathname: string) {
  return pathname === "/" || pathname === "/login" || pathname.startsWith("/user/");
}

export async function middleware(req: NextRequest) {
  if (isPublicPage(req.nextUrl.pathname)) return NextResponse.next();

  const session = await getSession(req);
  if (session) return NextResponse.next();

  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
