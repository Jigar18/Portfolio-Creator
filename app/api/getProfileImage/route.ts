import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

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

    const userDetails = await db.details.findUnique({
      where: { userId: userId },
      select: { imageUrl: true },
    });

    if (!userDetails) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: userDetails.imageUrl,
    });
  } catch (error) {
    console.error("Error fetching profile image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile image" },
      { status: 500 }
    );
  }
}
