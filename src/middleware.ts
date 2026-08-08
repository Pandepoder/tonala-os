import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const session = await getSession()
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  
  // Exclude API auth routes from middleware protection
  const isAuthApi = request.nextUrl.pathname.startsWith('/api/auth')
  
  // Protect all API routes except auth
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')

  // Not authenticated
  if (!session) {
    if (!isLoginPage && !isAuthApi) {
      if (isApiRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Authenticated but trying to access login
  if (isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
