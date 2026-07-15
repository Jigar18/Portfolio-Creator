import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
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

    // Get user's social links
    const socialLinks = await db.socialLink.findUnique({
      where: { userId: user.id },
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
