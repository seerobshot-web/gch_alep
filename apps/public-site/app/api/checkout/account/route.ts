import { NextRequest, NextResponse } from 'next/server';
import { InlineRegisterInput, createClient, clientLogin } from '@gch/fossbilling-client';
import { createRateLimiter } from '@gch/config/rate-limit';
import { createSessionCookieValue, SESSION_COOKIE_NAME } from '@/lib/session';

const limiter = createRateLimiter({ windowMs: 60000, max: 5 });

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!(await limiter.allow(ip))) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const body = await req.json();
  const parsed = InlineRegisterInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid', issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    // Create client in FOSSBilling as admin, then log them in to obtain a session cookie
    const client = await createClient({
      email: parsed.data.email,
      password: parsed.data.password,
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      company: parsed.data.company
    });

    const { sessionCookie } = await clientLogin(parsed.data.email, parsed.data.password);
    const res = NextResponse.json({ ok: true, client });

    // Our own first-party, gloryhosts.cloud-scoped session cookie
    res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(client.id), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    });
    // Forward FOSSBilling's own cookie too, for routes that talk to it directly
    if (sessionCookie) res.headers.append('set-cookie', sessionCookie);
    return res;
  } catch (err: any) {
    // If email exists, FOSSBilling may return a specific code — normalize to 500 for now
    return NextResponse.json({ error: 'create_failed', message: err.message ?? String(err) }, { status: 500 });
  }
}
