import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Fetch the email using our API endpoint
    const emailResponse = await fetch(`${req.nextUrl.origin}/api/emailFetch`, {
      headers: {
        Cookie: req.headers.get("cookie") || "",
      },
    });

    // This will follow redirects automatically

    if (!emailResponse.ok) {
      // Parse the response as JSON
      const errorData = await emailResponse.json();

      // Check if it's an auth error requiring GitHub permissions
      if (errorData.needsAuth && errorData.authUrl) {
        return NextResponse.json({
          status: "auth_required",
          authUrl: errorData.authUrl,
          message: errorData.error || "GitHub authorization required",
        });
      }

      // Other errors
      return NextResponse.json({
        status: "error",
        error: errorData.error || "Unknown error",
        status_code: emailResponse.status,
      });
    }

    // Success!
    const data = await emailResponse.json();
    return NextResponse.json({
      status: "success",
      data: data,
      message: "Email fetch successful",
    });
  } catch (error) {
    console.error("Email check error:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
