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

  const refreshCookie = request.cookies.get("refresh_token")?.value;
  const accessCookie = request.cookies.get("access_token")?.value;
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  const hasToken = !!(refreshCookie || accessCookie || bearerToken);

  console.log(
    `[Middleware] ${request.method} ${pathname} | hasToken: ${hasToken} ` +
      `(refresh: ${!!refreshCookie}, bearer: ${!!bearerToken})`,
  );

  if (
    pathname === "/payment/success" &&
    request.nextUrl.searchParams.has("reference")
  ) {
    return NextResponse.next();
  }

  // Only redirect from login page if user is already logged in
  if (hasToken && authRelatedPublicPaths.includes(pathname)) {
    console.log(
      `[Middleware] ✅ Already logged in → Redirecting to /dashboard`,
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For protected routes: allow them, let client-side ProtectedLayout handle the check
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    console.log(
      `[Middleware] ✅ Allowing protected route (client-side will check)`,
    );
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
