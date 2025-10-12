import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Public routes that don't need any checks
  const publicRoutes = [
    "/auth",
    "/api",
    "/_next",
    "/checkout",
    "/select-plan",
    "/orders",
    "/pricing",
    "/admin",
    "/", // Home is public
  ];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes require authentication AND active subscription
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/classes",
    "/schedule",
  ];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // If not logged in, redirect to signin
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    // If logged in but no subscription, redirect to checkout
    const hasSubscription = token.hasSubscription as boolean;
    if (!hasSubscription) {
      return NextResponse.redirect(new URL("/select-plan", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|shared.*).*)"],
};
