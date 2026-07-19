import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { removeStoredFile, uploadPdfFile } from "@/utils/uploadFiles";
import { PdfUploadRResponse } from "@/types/api";
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
      return NextResponse.json({ success: false, error: "Authentication token is invalid" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();

    if (!file) {
      console.log("No file provided in request");
      return NextResponse.json(
        { success: false, error: "No pdf file provided" },
        { status: 400 }
      );
    }

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Certificate title and description are required" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      console.log("Invalid file type:", file.type);
      return NextResponse.json(
        { success: false, error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      console.log("File size is larger than 3MB:", file.size);
      return NextResponse.json(
        { success: false, error: "File size must be less than 3MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const pdfUrl = await uploadPdfFile(
      buffer,
      file.name || "certificate.pdf",
      userId
    );

    let certificate;
    try {
      certificate = await db.certifications.create({
        data: { userId, title, description, pdfUrl },
      });
    } catch (error) {
      await removeStoredFile(pdfUrl, "certificates", `certifications/${userId}-`).catch((cleanupError) =>
        console.error("Unable to clean up the unsaved certificate file:", cleanupError)
      );
      throw error;
    }

    const response: PdfUploadRResponse & { certificate: typeof certificate } = {
      success: true,
      pdfUrl,
      certificate,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error uploading certificate:", error);
    const errorResponse: PdfUploadRResponse = {
      success: false,
      error: String(error),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
