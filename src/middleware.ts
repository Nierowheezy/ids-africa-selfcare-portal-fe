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
const landingPage = "/";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for tokens
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const isLoggedIn = !!accessToken || !!refreshToken;

  console.log(`[Middleware] ${pathname} | LoggedIn: ${isLoggedIn}`);

  // 1️⃣ Logged-in user trying to access login or home page → redirect to dashboard
  if (
    isLoggedIn &&
    (publicAuthPaths.includes(pathname) || pathname === landingPage)
  ) {
    console.log(`[Middleware] Logged in → Redirecting to /dashboard`);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2️⃣ Logged-out user trying to access protected pages → redirect to login
  if (!isLoggedIn && protectedPaths.some((path) => pathname.startsWith(path))) {
    console.log(`[Middleware] Not logged in → Redirecting to /login`);
    return NextResponse.redirect(new URL("/login", request.url));
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
    "/",
  ],
};
