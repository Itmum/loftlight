import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  // Where to send them if they are not logged in (and bring them back after)
  const { pathname, search } = request.nextUrl;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname + search);

  try {
    // Full check: the session is looked up and validated in the database
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    // If the database can't be reached, send them to login instead of
    // showing "Internal Server Error".
    console.error("Proxy session check failed:", error);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

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
