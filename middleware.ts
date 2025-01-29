// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of protected routes
const protectedRoutes = ["/profile", "/orders", "/checkout"];

export function middleware(request: NextRequest) {
  // Get the pathname from the request
  const pathname = request.nextUrl.pathname;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    // Get the access token and refresh token from cookies (or localStorage)
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // If no tokens are found, redirect to the login page
    if (!accessToken || !refreshToken) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Optionally, validate the tokens (e.g., check expiration)
    // You can call an API to validate the tokens or decode them locally
    // If the tokens are invalid, redirect to the login page
    // Example:
    // const isAccessTokenValid = validateToken(accessToken);
    // if (!isAccessTokenValid) {
    //   return NextResponse.redirect(new URL("/auth", request.url));
    // }
  }

  // Allow the request to proceed
  return NextResponse.next();
}
