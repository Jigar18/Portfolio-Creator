import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface Details {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  jobTitle: string;
  school: string;
  startYear: string;
  endYear: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData: Details = await req.json();
    await db.details.create({
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
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error adding Details", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
