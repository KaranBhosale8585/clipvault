import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/jwt";

const authPages = ["/login", "/signup"];
const protectedRoutes = ["/", "/api/get-me", "/verify"];
const adminRoutes = ["/admin"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("refresh_token")?.value;
  const user = token ? await verifyToken(token) : null;
  const isVerified = user?.isVerified;
  const role = user?.role;

   if (pathname.startsWith("/api")) {
     return NextResponse.next();
   }

  if (user && !isVerified && pathname !== "/verify") {
    return NextResponse.redirect(new URL("/verify", req.url));
  }

  if (!user && (protectedRoutes.includes(pathname) || adminRoutes.some(route => pathname.startsWith(route)))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (adminRoutes.some(route => pathname.startsWith(route)) && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (user && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup", "/verify", "/admin/:path*", "/api/:path*"],
};