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
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const isLoggedIn = !!refreshToken;

  console.log(`[Middleware] ${pathname} | LoggedIn: ${isLoggedIn}`);

  // 1. Logged-in user trying to access login or home page
  if (isLoggedIn) {
    if (publicAuthPaths.includes(pathname) || pathname === landingPage) {
      console.log(`[Middleware] Logged in → Redirecting to /dashboard`);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 2. Logged-out user trying to access protected pages
  if (!isLoggedIn) {
    if (protectedPaths.some((path) => pathname.startsWith(path))) {
      console.log(`[Middleware] Not logged in → Redirecting to /login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }
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
