import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("Middleware running");

  const token = request.cookies.get("access_token");
  console.log("Token found:", token);

  if (request.nextUrl.pathname.startsWith("/dashboard") && !token) {
    console.log("Redirecting to /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
