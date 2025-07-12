import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { title, description, pdfUrl } = data.card;

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

    const result = await db.certifications.create({
      data: {
        userId,
        title,
        description,
        pdfUrl,
      },
    });

    console.log("Database save successful:", result);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving certificate to database:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save certificate to database" },
      { status: 500 }
    );
  }
}
