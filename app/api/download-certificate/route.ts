import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const certificateId = searchParams.get("id");

    if (!certificateId) {
      return NextResponse.json(
        { error: "Certificate ID is required" },
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

    // Get the certificate from database
    const certificate = await db.certifications.findFirst({
      where: {
        id: certificateId,
        userId: userId,
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    console.log(
      "Downloading certificate:",
      certificate.title,
      "URL:",
      certificate.pdfUrl
    );

    // Fetch the PDF from Supabase
    const response = await fetch(certificate.pdfUrl);

    if (!response.ok) {
      console.error("Failed to fetch PDF from Supabase:", response.status);
      return NextResponse.json(
        { error: "Failed to fetch PDF file" },
        { status: response.status }
      );
    }

    const pdfBuffer = await response.arrayBuffer();

    // Generate a safe filename
    const safeTitle = certificate.title
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_");
    const filename = `${safeTitle}_certificate.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error downloading certificate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
