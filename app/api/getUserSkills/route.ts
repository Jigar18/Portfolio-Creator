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

    // Fetch user skills
    const userSkills = await db.skill.findMany({
      where: { userId: user.id },
    });

    // Extract skills array from the first record (if exists)
    const skills = userSkills.length > 0 ? userSkills[0].skills : [];
    const storedIconMap = userSkills.length > 0 ? userSkills[0].iconMap : null;
    const iconMap =
      storedIconMap &&
      typeof storedIconMap === "object" &&
      !Array.isArray(storedIconMap)
        ? storedIconMap
        : {};

    return NextResponse.json({
      success: true,
      skills: skills,
      iconMap,
    });
  } catch (error) {
    console.error("Error fetching user skills:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user skills" },
      { status: 500 }
    );
  }
}
