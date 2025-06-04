import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_REQUIRED = ['/dashboard']

// const ADMIN_ONLY = ['/dashboard/company', '/dashboard/category']

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const path = url.pathname
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (AUTH_REQUIRED.includes(path)) {
    if (!token) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
}
