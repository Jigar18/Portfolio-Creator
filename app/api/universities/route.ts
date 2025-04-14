import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const name = searchParams.get("name") || "";

    const res = await fetch(`http://universities.hipolabs.com/search?name=${name}`);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}