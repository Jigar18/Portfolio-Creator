import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const getCookie = (name: string) => {
      const cookieHeader = req.headers.get("cookie");
      if (!cookieHeader) return null;

      const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      return cookies[name];
    };

    const token = getCookie("id&Uname");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication token is missing",
        },
        { status: 401 }
      );
    }

    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      username: string;
    };

    if (!decoded.userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
        },
        { status: 401 }
      );
    }

    // Fetch user experiences from database
    const experiences = await db.experience.findMany({
      where: {
        userId: decoded.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      experiences: experiences,
    });
  } catch (error) {
    console.error("Error fetching user experiences:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch experiences",
      },
      { status: 500 }
    );
  }
}
