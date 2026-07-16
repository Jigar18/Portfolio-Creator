import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: Boolean(await getSession(request)) });
}
