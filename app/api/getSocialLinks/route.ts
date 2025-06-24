import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("id&Uname")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication token is missing" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const userId = payload.userId as string;

    // Get user's social links
    const socialLinks = await db.socialLink.findUnique({
      where: { userId: userId },
    });

    return NextResponse.json({
      success: true,
      socialLinks: socialLinks || {},
    });
  } catch (error) {
    console.error("Error fetching social links:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch social links" },
      { status: 500 }
    );
  }
}
