import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getInstallationAccessToken } from "@/lib/accessToken";

export async function GET(req: NextRequest) {
  try {
    const accessToken = await getInstallationAccessToken(req);
    const response = await axios.get("https://api.github.com/installation/repositories", {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json" },
      timeout: 10_000,
    });

    return NextResponse.json(response.data.repositories ?? []);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch repositories";
    const status = message.includes("Authentication") ? 401 : message.includes("installation") ? 404 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
