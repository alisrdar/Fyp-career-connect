import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Skip middleware for Next.js image optimization requests
  if (path.startsWith('/_next/image')) {
    return NextResponse.next();
  }

  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/verifyemail",
    "/contact",
    "/about",
  ];
  const isPublicPath = publicPaths.includes(path);
  const isHomePage = path === "/";

  const token = request.cookies.get("token")?.value || "";

  const isDashboardPath = path.startsWith("/dashboard");

  // if logged in and hitting home page → send to dashboard
  if (isHomePage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // if logged in and hitting other public paths → send to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // if not public and not logged in → signup
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }
  if (isDashboardPath && !token) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/verifyemail",
    "/contact",
    "/about",
    "/dashboard/:path*", // dashboard pages
    "/quiz/:path*", // quiz pages
    "/survey/:path*", // survey pages
    "/recommendations/:path*"
  ],
};
