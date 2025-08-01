import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const educationId = searchParams.get("id");

    if (!educationId) {
      return NextResponse.json(
        { success: false, error: "Education ID is required" },
        { status: 400 }
      );
    }

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

    const education = await db.education.findFirst({
      where: {
        id: educationId,
        userId: userId,
      },
    });

    if (!education) {
      return NextResponse.json(
        { success: false, error: "Education not found or unauthorized" },
        { status: 404 }
      );
    }

    await db.education.delete({
      where: {
        id: educationId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting education:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete education" },
      { status: 500 }
    );
  }
}
