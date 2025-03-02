import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear the token cookie
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0), // Expire the cookie immediately
    path: "/", // Apply to the entire site
  });

  return response;
}
