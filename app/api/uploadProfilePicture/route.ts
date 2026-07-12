import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { uploadFile } from "@/utils/uploadFiles";
import { UploadResponse } from "@/types/api";
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
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication token is invalid" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Only image files are supported" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageUrl = await uploadFile(
      buffer,
      file.name || "profile-picture.jpg",
      userId,
      file.type
    );

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { username: true },
    });
    if (!user) {
      throw new Error("Authenticated user was not found");
    }

    await db.details.update({
      where: { userId },
      data: { imageUrl },
    });

    const response: UploadResponse = {
      success: true,
      imageUrl,
      username: user.username,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    const message = error instanceof Error ? error.message : "Profile image upload failed";
    const errorResponse: UploadResponse = {
      success: false,
      error: message,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
