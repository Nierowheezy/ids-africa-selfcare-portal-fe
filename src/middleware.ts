// // src/middleware.ts
// import { NextRequest, NextResponse } from "next/server";

// const authRelatedPublicPaths = [
//   "/login",
//   "/reset-password",
//   "/", // landing page
// ];

// export async function middleware(request: NextRequest) {
//   const { pathname, searchParams } = request.nextUrl;

//   const accessToken = request.cookies.get("access_token")?.value;

//   // Special exception: Allow Paystack success callback without auth
//   if (pathname === "/payment/success" && searchParams.has("reference")) {
//     return NextResponse.next();
//   }

//   // 1. If user is already logged in → redirect AWAY from login/reset page
//   if (accessToken && authRelatedPublicPaths.includes(pathname)) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // 2. For all other routes (including protected ones) → just continue
//   //    We can no longer reliably check cookies here because of cross-origin
//   //    Protection will be handled on the client + backend instead

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/payment/:path*",
//     "/profile/:path*",
//     "/service-plan/:path*",
//     "/tickets/:path*",
//     "/",
//     "/login",
//     "/reset-password",
//   ],
// };

// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  // ✅ Always allow success page FIRST (most important)
  if (pathname === "/payment/success" && searchParams.has("reference")) {
    console.log("Middleware: Allowing /payment/success");
    return NextResponse.next();
  }

  // If user is logged in, redirect AWAY from these public pages
  if (accessToken) {
    if (
      pathname === "/login" ||
      pathname === "/reset-password" ||
      pathname === "/"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Allow Paystack success page even without token
  if (
    pathname === "/payment/success" &&
    request.nextUrl.searchParams.has("reference")
  ) {
    return NextResponse.next();
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
    "/",
    "/login",
    "/reset-password",
  ],
};
