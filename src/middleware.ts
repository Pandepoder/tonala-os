import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'

/**
 * Middleware Global de Seguridad (Tonalá OS)
 * 
 * Esta función es como el guardia de seguridad del proyecto.
 * Intercepta TODAS las peticiones que llegan al servidor ANTES de que lleguen
 * a las páginas o a las rutas de API.
 * 
 * Su trabajo principal es verificar si el usuario tiene una sesión activa (token válido).
 * Si no la tiene, le bloquea el paso y lo manda a la pantalla de /login.
 * 
 * @param {NextRequest} request - La petición entrante (página web o API)
 * @returns {NextResponse} - La respuesta (redirigir o dejar pasar)
 */
export async function middleware(request: NextRequest) {
  // 1. Buscamos el token de sesión del usuario en las cookies
  const session = await getSession()
  
  // 2. Revisamos si el usuario intenta entrar a la pantalla de login
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  
  // 3. Revisamos si está intentando acceder a las rutas de autenticación
  // (Debemos dejarlas pasar sin token, de lo contrario nadie podría iniciar sesión)
  const isAuthApi = request.nextUrl.pathname.startsWith('/api/auth')
  
  // 4. Identificamos si es una petición a nuestras APIs (CRM, Webhooks, etc)
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')

  // CASO A: El usuario NO tiene sesión iniciada
  if (!session) {
    if (!isLoginPage && !isAuthApi) {
      // Si intenta usar la API sin permiso, le escupimos un error 401 (No autorizado)
      if (isApiRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      // Si intenta ver una página (ej. el Dashboard), lo pateamos al /login
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Si va al login o a la API de auth, lo dejamos pasar
    return NextResponse.next()
  }

  // CASO B: El usuario SÍ tiene sesión iniciada, pero intenta entrar a /login
  if (isLoginPage) {
    // Ya estás adentro, te regresamos al Dashboard principal (/)
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Si tiene sesión y va a cualquier otra página, déjalo pasar libremente
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
