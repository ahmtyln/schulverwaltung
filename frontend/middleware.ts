import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DASHBOARD_PATHS = ["/admin", "/students", "/teachers", "/parents", "/list"];
const AUTH_PATHS = ["/login", "/register"];

function hasToken(request: NextRequest): boolean {
  const token = request.cookies.get("token")?.value;
  return !!token;
}

function isDashboardPath(pathname: string): boolean {
  return DASHBOARD_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = hasToken(request);

  if (isAuthPath(pathname) && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isDashboardPath(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/students/:path*", "/teachers/:path*", "/parents/:path*", "/list/:path*", "/login", "/register"],
};
