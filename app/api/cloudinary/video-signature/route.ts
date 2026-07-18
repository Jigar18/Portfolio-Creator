import { NextRequest, NextResponse } from "next/server";
import { createProjectVideoUploadSignature } from "@/lib/cloudinary";
import { getRequestUserId } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const userId = await getRequestUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Authentication is required" }, { status: 401 });
    }

    return NextResponse.json({ success: true, ...createProjectVideoUploadSignature(userId) });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unable to prepare the video upload" },
      { status: 500 }
    );
  }
}
