import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const skill = searchParams.get("skill") || "";
  const key = process.env.SKILL_KEY;

  const res = await axios.get(`https://api.apilayer.com/skills?q=${skill}`, {
    headers: {
        apiKey: key,
    }
  });

  return new Response(JSON.stringify(res.data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
