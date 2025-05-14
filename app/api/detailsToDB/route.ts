import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Details } from "@/types/api";
import { jwtVerify } from "jose";

export async function POST(req: NextRequest) {
  try {
    const formData: Details = await req.json();
    const details = await db.details.create({
      data: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        location: formData.location,
        jobTitle: formData.jobTitle,
        college: formData.school,
        startYear: Number(formData.startYear),
        endYear: Number(formData.endYear),
      },
    });

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

    
    await db.user.update({
      where: { id: userId },
      data: {
        detailsId: details.id,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error adding Details", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
