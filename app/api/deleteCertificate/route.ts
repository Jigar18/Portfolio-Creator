import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { removeStoredFile } from "@/utils/uploadFiles";

export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const certificateId = searchParams.get("id");

    if (!certificateId) {
      return NextResponse.json(
        { success: false, error: "Certificate ID is required" },
        { status: 400 }
      );
    }

    const certificate = await db.certifications.findFirst({
      where: {
        id: certificateId,
        userId: userId,
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: "Certificate not found" },
        { status: 404 }
      );
    }

    await removeStoredFile(
      certificate.pdfUrl,
      "certificates",
      `certifications/${userId}-`
    );

    await db.certifications.delete({
      where: {
        id: certificateId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete certificate" },
      { status: 500 }
    );
  }
}
