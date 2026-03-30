// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/payment", // ← protects /payment/history, /payment/make-payment, etc.
  "/profile",
  "/service-plan",
  "/tickets",
  // add more private routes here if needed
];

const authRelatedPublicPaths = [
  "/login",
  "/reset-password",
  "/", // landing page
  // add any other public pages that logged-in users should be redirected from
];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;

  // Special exception: Allow UNAUTHENTICATED access to /payment/success IF it has ?reference=...
  // This handles Paystack callback redirects
  if (pathname === "/payment/success" && searchParams.has("reference")) {
    // Let it through without checking token
    return NextResponse.next();
  }

  // 1. Protected/private routes → redirect to login if NO token
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    if (!accessToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname + request.nextUrl.search); // preserve original query too
      return NextResponse.redirect(url);
    }

    // Optional: Add strict token verification here later if you want
    // (e.g., call your /api/auth/me endpoint)
  }

  // 2. Auth-related public pages → redirect to dashboard if ALREADY logged in
  if (accessToken && authRelatedPublicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Everyone else → continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run middleware on these patterns
    "/dashboard/:path*",
    "/payment/:path*", // ← this covers /payment/success, /payment/history, etc.
    "/profile/:path*",
    "/service-plan/:path*",
    "/tickets/:path*",
    // Public auth pages (exact match)
    "/",
    "/login",
    "/reset-password",
  ],
};
