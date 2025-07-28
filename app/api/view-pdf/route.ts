import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pdfUrl = searchParams.get("url");

    if (!pdfUrl) {
      return NextResponse.json(
        { error: "PDF URL is required" },
        { status: 400 }
      );
    }

    // Decode the URL that was encoded in the frontend
    const decodedUrl = decodeURIComponent(pdfUrl);
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PDFProxy/1.0)',
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch PDF: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type");
    console.log("PDF content type:", contentType);

    const pdfBuffer = await response.arrayBuffer();
    console.log("PDF buffer size:", pdfBuffer.byteLength);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error serving PDF:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
