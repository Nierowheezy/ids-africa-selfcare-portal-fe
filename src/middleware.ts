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
  const { pathname } = request.nextUrl;

  // Check for token in cookies and Authorization header
  const refreshCookie = request.cookies.get("refresh_token")?.value;
  const accessCookie = request.cookies.get("access_token")?.value; // kept for backward compatibility
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  const hasToken = !!(refreshCookie || accessCookie || bearerToken);

  // Detailed logging - VERY IMPORTANT for debugging
  console.log(
    `[Middleware] ${request.method} ${pathname} | ` +
      `hasToken: ${hasToken} ` +
      `(refresh: ${!!refreshCookie}, accessCookie: ${!!accessCookie}, bearer: ${!!bearerToken})`,
  );

  // Special exception for Paystack success callback
  if (
    pathname === "/payment/success" &&
    request.nextUrl.searchParams.has("reference")
  ) {
    console.log(`[Middleware] Allowing Paystack success callback without auth`);
    return NextResponse.next();
  }

  // Protected routes - redirect to login if no token
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    console.log(`[Middleware] Protected route detected: ${pathname}`);

    if (!hasToken) {
      console.log(`[Middleware] ❌ No token found → Redirecting to /login`);
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname + request.nextUrl.search);
      return NextResponse.redirect(url);
    }

    console.log(
      `[Middleware] ✅ Token accepted for protected route: ${pathname}`,
    );
  }

  // Public auth pages - redirect to dashboard if already logged in
  if (hasToken && authRelatedPublicPaths.includes(pathname)) {
    console.log(
      `[Middleware] ✅ Already logged in on public page (${pathname}) → Redirecting to /dashboard`,
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  console.log(`[Middleware] ✅ Allowing request to continue: ${pathname}`);
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
