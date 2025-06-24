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

    // Fetch user skills
    const userSkills = await db.skill.findMany({
      where: { userId: userId },
    });

    // Extract skills array from the first record (if exists)
    const skills = userSkills.length > 0 ? userSkills[0].skills : [];

    return NextResponse.json({
      success: true,
      skills: skills,
    });
  } catch (error) {
    console.error("Error fetching user skills:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user skills" },
      { status: 500 }
    );
  }
}
