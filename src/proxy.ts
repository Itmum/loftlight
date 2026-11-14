import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Only asks: "is there a login cookie?" It never touches MongoDB, so it
// can't fail because of a database connection. (It's a quick gate for the
// pages. Your real security comes from the server checks you'll add later.)
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    // Send them to login, and bring them back to this page afterwards
    const { pathname, search } = request.nextUrl;
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only your private pages. Don't add /login or /signup here (redirect loop).
// Don't add /studios/... either: studio details should be public.
export const config = {
  matcher: [
    "/add-studio",
    "/my-booking",
    "/my-listing",
    "/update-studio/:path*",
    "/dashboard",
  ],
};
