// BUG FIX (#1): Next.js requires middleware.ts at the app root, next to
// `app/` — the scaffold's app/middleware.ts was never executed. For the
// ops app that meant NO host check ran at all, so this move is also a
// security fix: unauthorized hosts must see a 404 (CLAUDE.md topology:
// Vercel protection + 404-to-unauth).
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const hostname = req.nextUrl.hostname;
  if (!hostname.endsWith('ops.gloryhosts.cloud') && hostname !== 'localhost') {
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
