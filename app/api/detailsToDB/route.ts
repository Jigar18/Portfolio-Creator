import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });

  try {
    const form = await req.json() as Record<string, string>;
    const startYear = Number(form.startYear);
    const endYear = Number(form.endYear);
    if (!form.firstName?.trim() || !form.lastName?.trim() || !form.email?.trim() || !form.jobTitle?.trim() || !Number.isInteger(startYear) || !Number.isInteger(endYear)) {
      return NextResponse.json({ success: false, error: "Please complete all required details" }, { status: 400 });
    }

    await db.details.upsert({
      where: { userId: session.userId },
      update: { firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), location: form.location?.trim() ?? "", jobTitle: form.jobTitle.trim(), college: form.school?.trim() ?? "", startYear, endYear },
      create: { userId: session.userId, firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), location: form.location?.trim() ?? "", jobTitle: form.jobTitle.trim(), college: form.school?.trim() ?? "", startYear, endYear },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to save profile details" }, { status: 500 });
  }
}
