import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Helper function to verify JWT token with jose
async function verifyToken(token) {
  const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
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
  const isAdminPath = path.startsWith("/admin");

  const token = request.cookies.get("token")?.value || "";

  const isDashboardPath = path.startsWith("/dashboard");

  console.log(`[Middleware] Path: ${path}, Has token: ${!!token}, Token length: ${token.length}, isAdminPath: ${isAdminPath}, isPublicPath: ${isPublicPath}`);

  // Admin route protection - check if user is admin
  if (isAdminPath) {
    console.log(`[Middleware] Checking admin access for: ${path}`);
    if (!token) {
      console.log(`[Middleware] No token, redirecting to login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const decoded = await verifyToken(token);
      console.log(`[Middleware] Token decoded. isAdmin: ${decoded.isAdmin}`);
      if (!decoded.isAdmin) {
        // User is logged in but not admin - redirect to dashboard
        console.log(`[Middleware] User is not admin, redirecting to dashboard`);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      console.log(`[Middleware] Admin access granted for: ${path}`);
      return NextResponse.next();
    } catch (error) {
      // Invalid token - redirect to login
      console.log(`[Middleware] Invalid token, redirecting to login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // if logged in and hitting home page → redirect based on role
  if (isHomePage && token) {
    try {
      const decoded = await verifyToken(token);
      console.log(`[Middleware] User on homepage. isAdmin: ${decoded.isAdmin}, Email: ${decoded.email}`);
      if (decoded.isAdmin) {
        console.log(`[Middleware] Redirecting admin from homepage to /admin`);
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        console.log(`[Middleware] Redirecting user from homepage to /dashboard`);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      // Invalid token - let them stay on homepage
      console.log(`[Middleware] Invalid token on homepage. Error: ${error.message}, Name: ${error.name}`);
      console.log(`[Middleware] TOKEN_SECRET exists: ${!!process.env.TOKEN_SECRET}`);
      return NextResponse.next();
    }
  }
  
  // if logged in and hitting other public paths (login/signup) → redirect based on role
  if (isPublicPath && !isHomePage && token) {
    try {
      const decoded = await verifyToken(token);
      console.log(`[Middleware] User on public path ${path}. isAdmin: ${decoded.isAdmin}`);
      if (decoded.isAdmin) {
        console.log(`[Middleware] Redirecting admin from ${path} to /admin`);
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        console.log(`[Middleware] Redirecting user from ${path} to /dashboard`);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      // Invalid token - let them access public paths
      console.log(`[Middleware] Invalid token on public path, allowing access`);
      return NextResponse.next();
    }
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
    "/recommendations/:path*",
    "/admin/:path*" // admin pages (protected)
  ],
};
