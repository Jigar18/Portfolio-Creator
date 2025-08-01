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

    const education = await db.education.findMany({
      where: { userId: userId },
    });

    const sortedEducation = education.sort((a, b) => {
      if (a.isCurrently && !b.isCurrently) return -1;
      if (!a.isCurrently && b.isCurrently) return 1;

      const aEndYear = a.endYear || a.startYear;
      const bEndYear = b.endYear || b.startYear;

      if (aEndYear !== bEndYear) {
        return bEndYear - aEndYear;
      }

      return b.startYear - a.startYear;
    });

    if (education.length === 0) {
      const userDetails = await db.details.findUnique({
        where: { userId: userId },
      });

      if (userDetails?.college) {
        const defaultEducation = await db.education.create({
          data: {
            school: userDetails.college,
            degree: "Bachelor of Technology",
            field: "Computer Science",
            startYear: userDetails.startYear,
            endYear: userDetails.endYear,
            isCurrently: userDetails.endYear > new Date().getFullYear(),
            userId: userId,
          },
        });

        return NextResponse.json({
          success: true,
          education: [defaultEducation],
        });
      }
    }

    return NextResponse.json({
      success: true,
      education: sortedEducation,
    });
  } catch (error) {
    console.error("Error fetching education:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch education" },
      { status: 500 }
    );
  }
}
