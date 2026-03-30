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

  // Get authentication indicators
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const bearerToken = request.headers
    .get("authorization")
    ?.startsWith("Bearer ")
    ? request.headers.get("authorization")!.slice(7)
    : null;

  const isLoggedIn = !!(refreshToken || bearerToken);

  console.log(
    `[Middleware] ${request.method} ${pathname} | LoggedIn: ${isLoggedIn}`,
  );

  // ====================== REDIRECT LOGGED-IN USERS ======================
  // Prevent logged-in users from seeing landing page or login pages
  if (isLoggedIn) {
    if (publicAuthPaths.includes(pathname) || pathname === landingPage) {
      console.log(
        `[Middleware] ✅ Logged-in user trying to access ${pathname} → Redirecting to /dashboard`,
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // ====================== SPECIAL CASES ======================
  // Allow payment success page with reference
  if (
    pathname === "/payment/success" &&
    request.nextUrl.searchParams.has("reference")
  ) {
    return NextResponse.next();
  }

  // ====================== PROTECTED ROUTES ======================
  // Let protected routes proceed (client-side ProtectedLayout will handle auth check)
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Default: allow all other requests
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
    "/", // ← Important: Include root page
  ],
};
