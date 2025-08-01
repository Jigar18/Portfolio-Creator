import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

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
    const {
      school,
      degree,
      field,
      startYear,
      endYear,
      isCurrently,
      description,
    } = body;

    if (!school || !degree || !field || !startYear) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const education = await db.education.create({
      data: {
        school,
        degree,
        field,
        startYear: parseInt(startYear),
        endYear: endYear ? parseInt(endYear) : null,
        isCurrently: isCurrently || false,
        description: description || null,
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      education,
    });
  } catch (error) {
    console.error("Error adding education:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add education" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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
    const {
      id,
      school,
      degree,
      field,
      startYear,
      endYear,
      isCurrently,
      description,
    } = body;

    if (!id || !school || !degree || !field || !startYear) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const education = await db.education.update({
      where: {
        id,
        userId, // Ensure user can only update their own education
      },
      data: {
        school,
        degree,
        field,
        startYear: parseInt(startYear),
        endYear: endYear ? parseInt(endYear) : null,
        isCurrently: isCurrently || false,
        description: description || null,
      },
    });

    return NextResponse.json({
      success: true,
      education,
    });
  } catch (error) {
    console.error("Error updating education:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update education" },
      { status: 500 }
    );
  }
}
