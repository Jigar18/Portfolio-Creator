import { NextResponse } from "next/server";
import { db, getDbClientInfo } from "@/lib/db";

export async function GET() {
  try {
    const userCount = await db.user.count();

    // Test that our client is working
    return NextResponse.json({
      status: "ok",
      databaseConnected: true,
      userCount,
      clientInfo: getDbClientInfo(),
      databaseUrl: process.env.DATABASE_URL
        ? `${process.env.DATABASE_URL.split("://")[0]}://*****`
        : "Not set",
    });
  } catch (error) {
    console.error("Database debug error:", error);

    return NextResponse.json(
      {
        status: "error",
        databaseConnected: false,
        error: (error as Error).message,
        clientInfo: getDbClientInfo(),
      },
      { status: 500 }
    );
  }
}
