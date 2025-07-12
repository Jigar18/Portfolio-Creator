import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY!;

const supabase = createClient(PROJECT_URL, SUPABASE_API_KEY);

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

    try {
      // Extract the file path from the URL
      const url = new URL(certificate.pdfUrl);
      const pathSegments = url.pathname.split("/");
      const filePath = pathSegments.slice(-2).join("/");

      const { error: storageError } = await supabase.storage
        .from("certificates")
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
      } else {
        console.log("File deleted from storage successfully");
      }
    } catch (storageError) {
      console.error("Error processing storage deletion:", storageError);
    }

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
