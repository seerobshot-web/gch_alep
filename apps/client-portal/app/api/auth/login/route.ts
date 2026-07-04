import { NextRequest, NextResponse } from 'next/server';
// BUG FIX (#5): validate with the shared LoginInput schema (email +
// password only) — the scaffold validated logins against
// InlineRegisterInput, whose required first_name/last_name meant every
// real login 400'd. The express-rate-limit import is gone too: it's
// Express middleware and can't run in a Next route handler, so this uses
// the shared sliding-window limiter from @gch/config.
import { clientLogin, LoginInput } from '@gch/fossbilling-client';
import { createRateLimiter } from '@gch/config/rate-limit';

const limiter = createRateLimiter({ windowMs: 60000, max: 8 });

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!(await limiter.allow(ip))) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const parsed = LoginInput.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  try {
    const { client, sessionCookie } = await clientLogin(parsed.data.email, parsed.data.password);
    const res = NextResponse.json({ ok: true, client });
    if (sessionCookie) res.headers.set('set-cookie', sessionCookie);
    return res;
  } catch {
    return NextResponse.json({ error: 'auth_failed' }, { status: 401 });
  }
}
