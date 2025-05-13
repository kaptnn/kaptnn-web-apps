import { UserApi } from '@/utils/axios/api-service'
import { getCookie } from '@/utils/axios/utils'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_REQUIRED = ['/dashboard']

const ADMIN_ONLY = ['/dashboard/company', '/dashboard/category']

export async function middleware(request: NextRequest) {
  const { nextUrl } = request
  const { pathname } = nextUrl

  if (AUTH_REQUIRED.includes(pathname)) {
    const token = await getCookie('access_token')

    if (!token) {
      const loginUrl = nextUrl.clone()
      loginUrl.pathname = '/login'
      return NextResponse.redirect(loginUrl)
    }

    const currentUser = await UserApi.getCurrentUser(token)
    const isAdmin = currentUser.profile.role === 'admin'

    if (ADMIN_ONLY.includes(pathname) && !isAdmin) {
      const homeUrl = nextUrl.clone()
      homeUrl.pathname = '/dashboard'
      return NextResponse.redirect(homeUrl)
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
