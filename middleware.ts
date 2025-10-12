import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Allow access to auth pages, API routes, checkout and pricing
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/select-plan") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/pricing")
  ) {
    return NextResponse.next();
  }

  // If user is logged in, check if they have an active subscription
  if (token) {
    const hasSubscription = token.hasSubscription as boolean;

    // If no subscription, redirect to checkout
    if (!hasSubscription && pathname === "/") {
      return NextResponse.redirect(new URL("/checkout", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|shared.*).*)"],
};
