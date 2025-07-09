import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("id&Uname")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    
    await jwtVerify(token, secret);
    
    return NextResponse.next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/skills",]
  // matcher: ["/details", "/dashboard/:path*", "/user/:path*", "/skills", "/api/*"]
};