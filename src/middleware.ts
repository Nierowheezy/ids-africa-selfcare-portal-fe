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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Detect if user is logged in (best signal is refresh_token cookie)
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const isLoggedIn = !!refreshToken;

  console.log(`[Middleware] ${pathname} | LoggedIn: ${isLoggedIn}`);

  // ==================== CASE 1: Logged-in user accessing public pages ====================
  if (isLoggedIn) {
    if (publicAuthPaths.includes(pathname) || pathname === landingPage) {
      console.log(
        `[Middleware] Logged-in user → Redirecting from ${pathname} to /dashboard`,
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // ==================== CASE 2: Logged-out user accessing protected pages ====================
  if (!isLoggedIn) {
    if (protectedPaths.some((path) => pathname.startsWith(path))) {
      console.log(
        `[Middleware] Not logged in → Redirecting ${pathname} to /login`,
      );
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ==================== SPECIAL CASES ====================
  // Allow payment success page
  if (
    pathname === "/payment/success" &&
    request.nextUrl.searchParams.has("reference")
  ) {
    return NextResponse.next();
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
