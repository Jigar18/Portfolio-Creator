import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });

  try {
    const certificates = await db.certifications.findMany({
      where: { userId: session.userId },
      orderBy: { id: "desc" },
    });
    return NextResponse.json({ success: true, certificates });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch certificates" }, { status: 500 });
  }
}
