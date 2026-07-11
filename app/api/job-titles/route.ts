import { NextRequest, NextResponse } from "next/server";

type OnetResponse = {
  occupation?: Array<{ code: string; title: string }>;
};

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 80) {
    return NextResponse.json({ titles: [] });
  }

  const apiKey = process.env.ONET_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Job-title search is not configured", titles: [] }, { status: 503 });
  }

  try {
    const url = new URL("https://api-v2.onetcenter.org/online/search");
    url.searchParams.set("keyword", query);
    url.searchParams.set("end", "8");
    const authorization = `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
    const response = await fetch(url, {
      headers: { Authorization: authorization, Accept: "application/json" },
      next: { revalidate: 86_400 },
    });
    if (!response.ok) throw new Error(`O*NET lookup failed with ${response.status}`);

    const body = (await response.json()) as OnetResponse;
    return NextResponse.json({
      titles: (body.occupation ?? []).map(({ code, title }) => ({ code, title })),
      attribution: "O*NET Web Services",
    });
  } catch {
    return NextResponse.json({ error: "Unable to search job titles", titles: [] }, { status: 502 });
  }
}
