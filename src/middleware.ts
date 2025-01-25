import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth gerektiren sayfalara erişim kontrolü
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/reservations')) {
    
    // Firebase session cookie'sini kontrol et
    const session = request.cookies.get('session');
    
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Giriş yapmış kullanıcının login sayfasına erişimini engelle
  if (request.nextUrl.pathname === '/login') {
    const session = request.cookies.get('session');
    
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/reservations/:path*',
    '/login'
  ]
}; 