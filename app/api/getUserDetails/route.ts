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

    // Fetch user details
    const userDetails = await db.details.findUnique({
      where: { userId: userId },
    });

    if (!userDetails) {
      return NextResponse.json(
        { success: false, error: "User details not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      details: {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        location: userDetails.location,
        jobTitle: userDetails.jobTitle,
        college: userDetails.college,
        startYear: userDetails.startYear,
        endYear: userDetails.endYear,
        imageUrl: userDetails.imageUrl,
        about: userDetails.about,
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}
