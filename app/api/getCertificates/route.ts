import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    console.log("Fetching certificates request received");

    // const token = req.cookies.get("id&Uname")?.value;

    // if (!token) {
    //   return NextResponse.json(
    //     { success: false, error: "Authentication token is missing" },
    //     { status: 401 }
    //   );
    // }

    // const { payload } = await jwtVerify(
    //   token,
    //   new TextEncoder().encode(process.env.JWT_SECRET!)
    // );
    // const userId = payload.userId as string;
    const userId = "f7fa07d7-81eb-4f8e-aabb-049c65cc6e58";

    const certificates = await db.certifications.findMany({
      where: { userId: userId },
    });

    return NextResponse.json({
      success: true,
      certificates: certificates,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}
