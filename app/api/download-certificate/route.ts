import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resolvePortfolioUser } from "@/lib/publicPortfolio";

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

    const user = await resolvePortfolioUser(req);
    if (!user) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    // Get the certificate from database
    const certificate = await db.certifications.findFirst({
      where: {
        id: certificateId,
        userId: user.id,
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
