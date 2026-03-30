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

  // Check for token in two places:
  // 1. Cookie (refresh_token backup)
  // 2. Authorization Bearer header (main access token from localStorage)
  const cookieToken =
    request.cookies.get("access_token")?.value ||
    request.cookies.get("refresh_token")?.value;

  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  const hasToken = !!(cookieToken || bearerToken);

  // Detailed logging for debugging
  console.log(
    `[Middleware] ${request.method} ${pathname} | hasToken: ${hasToken} (cookie: ${!!cookieToken}, bearer: ${!!bearerToken})`,
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
      console.log(`[Middleware] ❌ No token found → Redirecting to /login`);
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname + request.nextUrl.search);
      return NextResponse.redirect(url);
    }

    console.log(`[Middleware] ✅ Token found for protected route: ${pathname}`);
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
