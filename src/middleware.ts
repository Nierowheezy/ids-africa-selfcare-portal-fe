// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/payment",
  "/profile",
  "/service-plan",
  "/tickets",
];

const PUBLIC_AUTH_ROUTES = ["/login", "/reset-password"];
const LANDING_PAGE = "/";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const isLoggedIn = !!refreshToken; // Most reliable signal

  // Case 1: Logged-in user trying to access login/landing page
  if (
    isLoggedIn &&
    (PUBLIC_AUTH_ROUTES.includes(pathname) || pathname === LANDING_PAGE)
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Case 2: Logged-out user trying to access protected pages
  if (
    !isLoggedIn &&
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow everything else
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
    "/",
  ],
};
