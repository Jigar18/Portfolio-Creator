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
      if (emailResponse.status === 302 || emailResponse.status === 307) {
        // This is a redirect, tell the client
        const location = emailResponse.headers.get("location");
        return NextResponse.json({
          status: "redirect",
          location: location,
          message: "Email fetch redirected for OAuth permissions",
        });
      }

      // Other errors
      const errorData = await emailResponse.json();
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
