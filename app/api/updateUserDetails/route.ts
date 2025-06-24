import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

interface UpdateData {
  about?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  location?: string;
  imageUrl?: string;
  jobTitle ?: string;
  college ?: string;
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
      about,
      firstName,
      lastName,
      email,
      location,
      jobTitle,
      college,
      imageUrl,
    } = body;

    // Build the update data object dynamically
    const updateData: UpdateData = {};

    if (about !== undefined) updateData.about = about;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (location !== undefined) updateData.location = location;
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
    if (college !== undefined) updateData.college = college;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    // Ensure at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    const updatedDetails = await db.details.upsert({
      where: { userId: userId },
      update: updateData,
      create: {
        userId: userId,
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
        location: location || "",
        jobTitle: jobTitle || "",
        college: college || "",
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear() + 4,
        about: about || "",
        imageUrl: imageUrl || "",
      },
    });

    return NextResponse.json({
      success: true,
      details: {
        firstName: updatedDetails.firstName,
        lastName: updatedDetails.lastName,
        email: updatedDetails.email,
        location: updatedDetails.location,
        jobTitle: updatedDetails.jobTitle,
        college: updatedDetails.college,
        about: updatedDetails.about,
        imageUrl: updatedDetails.imageUrl,
      },
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user details" },
      { status: 500 }
    );
  }
}
