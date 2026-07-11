import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/accessToken";

export async function GET(req: NextRequest) {
  try {
    const accessToken = await getAccessToken(req);
    const response = await axios.get("https://api.github.com/user/installations", {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json" },
      timeout: 10_000,
    });

    return NextResponse.json({ installations: response.data.installations ?? [] });
  } catch (error) {
    const status = axios.isAxiosError(error) && error.response?.status === 401 ? 401 : 502;
    return NextResponse.json({ error: "Unable to retrieve GitHub App installations" }, { status });
  }
}
