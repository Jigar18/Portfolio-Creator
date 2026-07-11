import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const name = searchParams.get("name")?.trim() || "";
    if (name.length < 2 || name.length > 100) {
        return Response.json([]);
    }

    try {
        const res = await fetch(`https://universities.hipolabs.com/search?name=${encodeURIComponent(name)}`, {
            next: { revalidate: 86_400 },
        });
        if (!res.ok) throw new Error("University provider failed");
        return Response.json(await res.json());
    } catch {
        return Response.json({ error: "Unable to search universities" }, { status: 502 });
    }
}
