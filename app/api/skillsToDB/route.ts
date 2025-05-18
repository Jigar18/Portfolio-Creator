import { db } from "@/lib/db";
import { Skill } from "@/types/api";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const selectedSkills: string[] = await req.json();
    const token = req.cookies.get("id&Uname")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication token is missing" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const userId = payload.userId as string;

    await db.skill.create({
      data: {
        skills: selectedSkills,
        userId: userId
      },
    });
    
  } catch (err) {
    console.error("Error adding Details", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
