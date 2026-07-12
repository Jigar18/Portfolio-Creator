import { NextRequest, NextResponse } from "next/server";

type EscoResponse = {
  _embedded?: {
    results?: Array<{ uri: string; title: string }>;
  };
};

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 80) {
    return NextResponse.json({ titles: [] });
  }

  try {
    const url = new URL("https://ec.europa.eu/esco/api/search");
    url.searchParams.set("text", query);
    url.searchParams.set("type", "occupation");
    url.searchParams.set("language", "en");
    url.searchParams.set("limit", "8");
    url.searchParams.set("offset", "0");
    url.searchParams.set("selectedVersion", "v1.2.1");
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86_400 },
    });
    if (!response.ok) throw new Error(`ESCO lookup failed with ${response.status}`);

    const body = (await response.json()) as EscoResponse;
    return NextResponse.json({
      titles: (body._embedded?.results ?? []).map(({ uri, title }) => ({
        code: uri,
        title,
      })),
      attribution: "ESCO — European Commission",
    });
  } catch (error) {
    console.error("Job-title search failed:", error);
    return NextResponse.json({ error: "Unable to search job titles", titles: [] }, { status: 502 });
  }
}
