import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
    const path = request.nextUrl.pathname;

    const publicPaths = ['/login', '/signup', '/verifyemail', '/contact', '/about'];
    const isPublicPath = publicPaths.includes(path);

    const token = request.cookies.get("token")?.value || '';

    const isDashboardPath = path.startsWith('/dashboard');

    if(isPublicPath && token){
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if(!isPublicPath && !token){
        return NextResponse.redirect(new URL('/signup', request.url));
    }
    if (isDashboardPath && !token) {
        return NextResponse.redirect(new URL("/signup", request.url));
    }
    return NextResponse.next();
    
}

// See "Matching Paths" below to learn more
export const config = {
    matcher:[ 
        '/login', 
        '/signup', 
        '/contact',
        '/about',
        '/verifyemail',
        '/dashboard/:path*'
    ],
};
