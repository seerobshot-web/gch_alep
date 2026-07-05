// BUG FIX (#1): Next.js requires middleware.ts at the app root, next to
// `app/` — the scaffold's app/middleware.ts was never executed, so the
// host check and security headers below silently never applied.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Deploy-preview hosts (Netlify/Vercel) are allowed through the host
// check so branch previews render; production binds to my.gloryhosts.cloud.
function allowedHost(hostname: string): boolean {
  return (
    hostname.endsWith('my.gloryhosts.cloud') ||
    hostname === 'localhost' ||
    hostname.endsWith('.netlify.app') ||
    hostname.endsWith('.vercel.app')
  );
}

export function middleware(req: NextRequest) {
  if (!allowedHost(req.nextUrl.hostname)) {
    return new NextResponse('Not Found', { status: 404 });
  }
  const res = NextResponse.next();
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Content-Security-Policy', "default-src 'self'");
  return res;
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)'
};
