import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/jwt";

const authPages = ["/login", "/signup"];
const protectedRoutes = ["/dashboard", "/history", "/admin", "/verify", "/unlimited-access"];

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const host = req.headers.get("host");

  // 1. Permanent 301 Redirect for the Render domain to the primary domain
  if (host && (host === "clipvault-eohk.onrender.com" || host.endsWith(".onrender.com"))) {
    const redirectUrl = `https://clipvault.online${pathname}${search}`;
    const response = NextResponse.redirect(redirectUrl, 301);
    
    // SEO safety net: tell search engines that the Render domain should not be indexed
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
  }

  // Bypass API routes, health check, and static files for internal routing check
  if (pathname === "/health" || pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("refresh_token")?.value;
  const decoded = token ? await verifyToken(token) : null;
  
  // Only consider it a "user" if it has an ID (authenticated)
  const user = decoded?.id ? decoded : null;
  const isVerified = user?.isVerified;
  const role = user?.role;

  // Force verification if not verified
  if (user && !isVerified && pathname !== "/verify") {
    return NextResponse.redirect(new URL("/verify", req.url));
  }

  // Protect routes from unauthenticated users
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (!user && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect Admin routes from non-admin users
  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect logged-in users away from auth pages
  if (user && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths to ensure domain-level redirects happen for all assets,
     * while allowing internal fast-path bypasses for static files/APIs.
     */
    "/:path*",
  ],
};
