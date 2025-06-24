import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "../../../lib/db";

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { socialLinks } = body;

    if (!socialLinks || typeof socialLinks !== "object") {
      return NextResponse.json(
        { success: false, error: "Social links must be an object" },
        { status: 400 }
      );
    }

    // Prepare the data for upsert - only include defined platform columns
    const allowedPlatforms = [
      "email",
      "twitter",
      "linkedin",
      "instagram",
      "github",
      "medium",
      "blog",
      "leetcode",
      "youtube",
      "portfolio",
      "hackerrank",
    ];

    const updateData: Record<string, string | null> = {};

    // Only include platforms that are in our allowed list
    allowedPlatforms.forEach((platform) => {
      if (socialLinks.hasOwnProperty(platform)) {
        updateData[platform] = socialLinks[platform] || null;
      }
    });

    // Upsert the social links record
    const updatedLinks = await db.socialLink.upsert({
      where: { userId: userId },
      update: updateData,
      create: {
        userId: userId,
        ...updateData,
      },
    });

    return NextResponse.json({
      success: true,
      socialLinks: updatedLinks,
    });
  } catch (error) {
    console.error("Error updating social links:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update social links" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return POST(req); // Use the same logic for PUT requests
}
