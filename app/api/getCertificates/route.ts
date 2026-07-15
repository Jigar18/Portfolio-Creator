import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolioLookupStatus, resolvePortfolioUser } from "@/lib/publicPortfolio";

export async function GET(req: NextRequest) {
  const user = await resolvePortfolioUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Portfolio not found" }, { status: portfolioLookupStatus(req) });

  try {
    const certificates = await db.certifications.findMany({
      where: { userId: user.id },
      orderBy: { id: "desc" },
    });
    return NextResponse.json({ success: true, certificates });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch certificates" }, { status: 500 });
  }
}
