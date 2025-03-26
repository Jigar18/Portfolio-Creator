import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.formData();
    const pdf = data.get("pdf");

    if (!(pdf instanceof File)) {
        return NextResponse.json({success: false});
    }
    
    try {
        const bufferData = await pdf.arrayBuffer();
        const buffer = Buffer.from(bufferData);
        const path = `./public/uploads/${pdf.name}`;
        await writeFile(path, buffer, "utf-8");
        return NextResponse.json({reponse: "Successfully Uploaded", success: true});
    }
    catch(error) {
        console.log(error);
        return NextResponse.json({success: false});
    }
}