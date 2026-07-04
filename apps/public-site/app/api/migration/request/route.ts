import { NextRequest, NextResponse } from 'next/server';
import { InlineRegisterInput, createOrder, createClient } from '@gch/fossbilling-client';
import { createRateLimiter } from '@gch/config/rate-limit';

const limiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 3 });

// Manual-fulfillment product used for migration requests — must match a
// real product id on the live FOSSBilling instance (VERIFY-AGAINST-INSTALL).
const MIGRATION_PRODUCT_ID = 0;

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!(await limiter.allow(ip))) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const body = await req.json();
  const parsed = InlineRegisterInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  // Manual-fulfillment ticket: create the client + a manual product order
  try {
    const client = await createClient({
      email: parsed.data.email,
      password: parsed.data.password,
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      company: parsed.data.company
    });

    const order = await createOrder({
      client_id: client.id,
      product_id: MIGRATION_PRODUCT_ID,
      period: 'monthly',
      config: {}
    });

    return NextResponse.json({ ok: true, order });
  } catch (err: any) {
    return NextResponse.json({ error: 'failed', message: err.message ?? String(err) }, { status: 500 });
  }
}
