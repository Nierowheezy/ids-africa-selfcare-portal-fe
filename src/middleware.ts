// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/payment",
  "/profile",
  "/service-plan",
  "/tickets",
];

const publicAuthPaths = ["/login", "/reset-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get tokens
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const accessToken = request.cookies.get("access_token")?.value;
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  const isLoggedIn = !!(refreshToken || bearerToken || accessToken);

  console.log(
    `[Middleware] ${request.method} ${pathname} | LoggedIn: ${isLoggedIn}`,
  );

  // 1. If user is logged in and tries to access login or reset-password → redirect to dashboard
  if (isLoggedIn && publicAuthPaths.includes(pathname)) {
    console.log(
      `[Middleware] ✅ User is logged in → Redirecting from ${pathname} to /dashboard`,
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Special case for payment success page
  if (
    pathname === "/payment/success" &&
    request.nextUrl.searchParams.has("reference")
  ) {
    return NextResponse.next();
  }

  // 3. For protected routes - we let the request go through (client-side ProtectedLayout will handle redirect if needed)
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/payment/:path*",
    "/profile/:path*",
    "/service-plan/:path*",
    "/tickets/:path*",
    "/login",
    "/reset-password",
  ],
};
