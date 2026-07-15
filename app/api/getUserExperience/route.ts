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

    // Fetch user experiences from database
    const experiences = await db.experience.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      experiences: experiences,
    });
  } catch (error) {
    console.error("Error fetching user experiences:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch experiences",
      },
      { status: 500 }
    );
  }
}
