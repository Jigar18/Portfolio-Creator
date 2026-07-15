import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolioLookupStatus, resolvePortfolioUser } from "@/lib/publicPortfolio";

export async function GET(req: NextRequest) {
  try {
    const user = await resolvePortfolioUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: portfolioLookupStatus(req) }
      );
    }

    // Fetch user details
    const userDetails = await db.details.findUnique({
      where: { userId: user.id },
    });

    if (!userDetails) {
      return NextResponse.json(
        { success: false, error: "User details not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      username: user.username,
      isOwner: user.isOwner,
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
