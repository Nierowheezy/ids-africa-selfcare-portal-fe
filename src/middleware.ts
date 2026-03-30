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
  const accessToken = request.cookies.get("access_token")?.value;
  const hasToken = !!accessToken;

  // Detailed logging for debugging
  console.log(
    `[Middleware] ${request.method} ${pathname} | hasToken: ${hasToken}`,
  );

  // Special exception for Paystack success callback
  if (
    pathname === "/payment/success" &&
    request.nextUrl.searchParams.has("reference")
  ) {
    console.log(`[Middleware] Allowing Paystack success callback without auth`);
    return NextResponse.next();
  }

  // 1. Protected routes → redirect to login if no token
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    console.log(`[Middleware] Protected route detected: ${pathname}`);

    if (!hasToken) {
      console.log(`[Middleware] ❌ No access_token → Redirecting to /login`);
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname + request.nextUrl.search);
      return NextResponse.redirect(url);
    }

    console.log(`[Middleware] ✅ Token found for protected route: ${pathname}`);
    // You can add more strict verification here later if needed
  }

  // 2. Public auth pages → redirect to dashboard if already logged in
  if (hasToken && authRelatedPublicPaths.includes(pathname)) {
    console.log(
      `[Middleware] ✅ User already logged in + on public page (${pathname}) → Redirecting to /dashboard`,
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
