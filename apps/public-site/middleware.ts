// BUG FIX (#1): Next.js requires middleware.ts to live at the app root,
// next to the `app/` directory — a file at app/middleware.ts is never
// picked up and the host-matching / security-header logic below silently
// never ran.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@gch/config/env';

// Deploy-preview hosts (Netlify/Vercel) are allowed through the host
// check so branch previews render; production traffic still binds to the
// real domain via DNS. Platform access controls should protect the
// platform subdomains themselves.
function allowedHost(hostname: string): boolean {
  return (
    hostname.endsWith('gloryhosts.cloud') ||
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
  res.headers.set('Content-Security-Policy', `default-src 'self' ${env.FOSSBILLING_URL}`);
  return res;
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)'
};
