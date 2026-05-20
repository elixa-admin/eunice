import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Parent Portal routes
  const isParentRoute = pathname.startsWith('/parent');
  // Protect Admin Dashboard routes
  const isAdminRoute = pathname.startsWith('/admin');

  if (isParentRoute || isAdminRoute) {
    // Check if Supabase session cookies exist
    // Supabase JS client stores tokens in cookies like 'sb-access-token' or 'sb-[ref]-auth-token'
    const allCookies = request.cookies.getAll();
    const hasAuthCookie = allCookies.some(cookie => 
      cookie.name.includes('sb-') || 
      cookie.name.includes('supabase')
    );

    // If no auth cookie is present, redirect to the Sign In page
    if (!hasAuthCookie) {
      console.log(`[Middleware] Unauthorized access to ${pathname}, redirecting to /auth/signin`);
      const signInUrl = new URL('/auth/signin', request.url);
      // Pass the original target URL in next query param for redirection after signin
      signInUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Allow request to proceed
  return NextResponse.next();
}

// Specify the paths that the middleware should run on
export const config = {
  matcher: [
    '/parent/:path*',
    '/admin/:path*',
  ],
};
