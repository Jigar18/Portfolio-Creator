import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const selectedSkills: string[] = body.skills;

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

    const existingSkill = await db.skill.findFirst({
      where: {
        userId: userId,
      },
    });

    if (existingSkill) {
      await db.skill.update({
        where: {
          id: existingSkill.id,
        },
        data: {
          skills: selectedSkills,
        },
      });
    } else {
      await db.skill.create({
        data: {
          skills: selectedSkills,
          userId: userId,
        },
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error("Error updating skills:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
