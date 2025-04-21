import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Convert JWT_SECRET to proper format for jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    
    // Verify the token
    await jwtVerify(token, secret);
    
    // If verification succeeds, allow the request
    return NextResponse.next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/details", "/dashboard/:path*", "/user/:path*"],
};