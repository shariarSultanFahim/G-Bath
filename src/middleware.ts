import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow API routes & public assets
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/uploads")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Not logged in -> redirect to login page
  if (!token) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = token.role as string;

  // Protect Admin UI pages
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect Seller UI pages (prevent admin from viewing seller view unless navigating directly)
  if (!pathname.startsWith("/admin") && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
