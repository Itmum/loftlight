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
    "/studios/:path*",
    // "/dashboard",
  ],
};

//version2
// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "./lib/auth";
// import { headers } from "next/headers";

// export async function proxy(request: NextRequest) {
//   // Where to send them if they are not logged in (and bring them back after)
//   const { pathname, search } = request.nextUrl;
//   const loginUrl = new URL("/login", request.url);
//   loginUrl.searchParams.set("redirect", pathname + search);

//   try {
//     // Full check: the session is looked up and validated in the database
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });

//     if (!session?.user) {
//       return NextResponse.redirect(loginUrl);
//     }
//   } catch (error) {
//     // If the database can't be reached, send them to login instead of
//     // showing "Internal Server Error".
//     console.error("Proxy session check failed:", error);
//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/add-studio",
//     "/my-booking",
//     "/my-listing",
//     "/update-studio/:path*",
//     "/studios/:path*",
//     // "/dashboard",
//   ],
// };

//version1
// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "./lib/auth";
// import { headers } from "next/headers";
// // This function can be marked `async` if using `await` inside
// export async function proxy(request: NextRequest) {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });
//   const user = session?.user;
//   if (!user) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
// }

// // Alternatively, you can use a default export:
// // export default function proxy(request: NextRequest) { ... }

// export const config = {
//   // matcher: "/about/:path*",
//   matcher: [
//     "/add-studio",
//     "/my-booking",
//     "/my-listing",
//     "/update-studio/:path*",
//     // "/dashboard",
//   ],
// };
