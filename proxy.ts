import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/jwt";

const authPages = ["/login", "/signup"];
const protectedRoutes = ["/dashboard", "/history", "/admin", "/verify"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bypass API routes and static files
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("refresh_token")?.value;
  const decoded = token ? await verifyToken(token) : null;
  
  // Only consider it a "user" if it has an ID (authenticated)
  const user = decoded?.id ? decoded : null;
  const isVerified = user?.isVerified;
  const role = user?.role;

  // 1. Force verification if not verified
  if (user && !isVerified && pathname !== "/verify") {
    return NextResponse.redirect(new URL("/verify", req.url));
  }

  // 2. Protect routes from unauthenticated users
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (!user && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Protect Admin routes from non-admin users
  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 4. Redirect logged-in users away from auth pages
  if (user && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
