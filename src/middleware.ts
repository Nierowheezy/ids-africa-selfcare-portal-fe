// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/payment",
  "/profile",
  "/service-plan",
  "/tickets",
];

const authRelatedPublicPaths = ["/login", "/reset-password", "/"];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;

  // Special case: allow Paystack redirect callback even without token
  if (pathname === "/payment/success" && searchParams.has("reference")) {
    return NextResponse.next();
  }

  // ---------- Protected Routes ----------
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    // No token → redirect to login
    if (!accessToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname + request.nextUrl.search);
      return NextResponse.redirect(url);
    }

    // Optional: Validate token by hitting your backend `/api/auth/me`
    // If invalid → redirect to login
    try {
      const baseUrl = request.nextUrl.origin;
      const meRes = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { cookie: `access_token=${accessToken}` },
      });

      if (!meRes.ok) {
        const url = new URL("/login", request.url);
        url.searchParams.set("redirect", pathname + request.nextUrl.search);
        return NextResponse.redirect(url);
      }
    } catch {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname + request.nextUrl.search);
      return NextResponse.redirect(url);
    }
  }

  // ---------- Public Auth Pages ----------
  if (authRelatedPublicPaths.includes(pathname) && accessToken) {
    // Already logged in → redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ---------- Everything else ----------
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
