import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("Middleware running");
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const access_token = request.cookies.get("access_token")?.value;
    console.log("Token found:", access_token);

    if (!access_token) {
      console.log("Redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
