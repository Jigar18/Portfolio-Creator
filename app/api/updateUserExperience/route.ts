import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const getCookie = (name: string) => {
      const cookieHeader = req.headers.get("cookie");
      if (!cookieHeader) return null;
      
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      
      return cookies[name];
    };

    const token = getCookie("id&Uname");

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: "Authentication token is missing" 
      }, { status: 401 });
    }

    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      username: string;
    };

    if (!decoded.userId) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid token" 
      }, { status: 401 });
    }

    const body = await req.json();
    const { 
      company, 
      position, 
      startMonth, 
      startYear, 
      endMonth, 
      endYear, 
      isCurrentRole, 
      contributions 
    } = body;

    // Validate required fields
    if (!company || !position || !startMonth || !startYear) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    // Create new experience entry
    const experience = await db.experience.create({
      data: {
        company,
        position,
        startMonth,
        startYear,
        endMonth: isCurrentRole ? null : endMonth,
        endYear: isCurrentRole ? null : endYear,
        isCurrentRole,
        contributions: contributions || [],
        userId: decoded.userId,
      }
    });

    return NextResponse.json({
      success: true,
      experience: experience
    });

  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create experience" 
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const getCookie = (name: string) => {
      const cookieHeader = req.headers.get("cookie");
      if (!cookieHeader) return null;
      
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      
      return cookies[name];
    };

    const token = getCookie("id&Uname");

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: "Authentication token is missing" 
      }, { status: 401 });
    }

    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      username: string;
    };

    if (!decoded.userId) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid token" 
      }, { status: 401 });
    }

    const body = await req.json();
    const { 
      id,
      company, 
      position, 
      startMonth, 
      startYear, 
      endMonth, 
      endYear, 
      isCurrentRole, 
      contributions 
    } = body;

    // Validate required fields
    if (!id || !company || !position || !startMonth || !startYear) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    // Update existing experience entry
    const experience = await db.experience.update({
      where: {
        id: id,
        userId: decoded.userId, // Ensure user owns this experience
      },
      data: {
        company,
        position,
        startMonth,
        startYear,
        endMonth: isCurrentRole ? null : endMonth,
        endYear: isCurrentRole ? null : endYear,
        isCurrentRole,
        contributions: contributions || [],
      }
    });

    return NextResponse.json({
      success: true,
      experience: experience
    });

  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update experience" 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const getCookie = (name: string) => {
      const cookieHeader = req.headers.get("cookie");
      if (!cookieHeader) return null;
      
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      
      return cookies[name];
    };

    const token = getCookie("id&Uname");

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: "Authentication token is missing" 
      }, { status: 401 });
    }

    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      username: string;
    };

    if (!decoded.userId) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid token" 
      }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Experience ID is required" 
      }, { status: 400 });
    }

    // Delete experience entry
    await db.experience.delete({
      where: {
        id: id,
        userId: decoded.userId, // Ensure user owns this experience
      }
    });

    return NextResponse.json({
      success: true,
      message: "Experience deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete experience" 
      },
      { status: 500 }
    );
  }
}
