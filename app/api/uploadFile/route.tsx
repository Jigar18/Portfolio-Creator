import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(request: Request) {
  const data = await request.formData();

  const file = data.get("file") || data.get("pdf") || data.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json(
      {
        success: false,
        error: "No file uploaded or invalid file",
      },
      { status: 400 }
    );
  }

  try {
    const uploadsDir = "./public/uploads";

    const fileExtension = path.extname(file.name);
    const fileType = getFileType(fileExtension);
    const uniqueFileName = `${Date.now()}-${file.name}`;
    const filePath = `${uploadsDir}/${uniqueFileName}`;

    const bufferData = await file.arrayBuffer();
    const buffer = Buffer.from(bufferData);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: `${fileType} uploaded successfully`,
      fileName: uniqueFileName,
      fileUrl: `/uploads/${uniqueFileName}`,
      fileType: fileType.toLowerCase(),
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload file",
      },
      { status: 500 }
    );
  }
}

function getFileType(extension: string): string {
  extension = extension.toLowerCase();

  if (extension === ".pdf") {
    return "PDF";
  } else if (
    [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(extension)
  ) {
    return "Image";
  } else if ([".doc", ".docx"].includes(extension)) {
    return "Document";
  } else {
    return "File";
  }
}
