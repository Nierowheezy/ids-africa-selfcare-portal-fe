// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

const authRelatedPublicPaths = [
  "/login",
  "/reset-password",
  "/", // landing page
];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;

  // Special exception: Allow Paystack success callback without auth
  if (pathname === "/payment/success" && searchParams.has("reference")) {
    return NextResponse.next();
  }

  // 1. If user is already logged in → redirect AWAY from login/reset page
  if (accessToken && authRelatedPublicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. For all other routes (including protected ones) → just continue
  //    We can no longer reliably check cookies here because of cross-origin
  //    Protection will be handled on the client + backend instead

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/payment/:path*",
    "/profile/:path*",
    "/service-plan/:path*",
    "/tickets/:path*",
    "/",
    "/login",
    "/reset-password",
  ],
};
