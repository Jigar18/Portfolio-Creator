import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const selectedSkills : string[] = await req.json();
    console.log(selectedSkills);
    // const skills = await db.skill.create({
    //     data: {
    //         name: selectedSkills
    //     }
    // })
  } catch (err) {
    console.error("Error adding Details", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
