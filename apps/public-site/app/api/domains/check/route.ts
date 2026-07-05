import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createRateLimiter } from '@gch/config/rate-limit';
import { ResellersPanelClient } from '@gch/resellerspanel-adapter';

export const dynamic = 'force-dynamic';

const limiter = createRateLimiter({ windowMs: 60000, max: 10 });

const Query = z.object({
  domain: z
    .string()
    .min(4)
    .max(253)
    .regex(/^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z]{2,24})+$/i, 'invalid domain')
});

/**
 * Domain availability via ResellersPanel's verified `check_avail` command
 * (demo-mode friendly). Raw supplier response is passed through untyped —
 * response schema is fixture-gated (CLAUDE.md rule 5); the checkout UI
 * must treat it as advisory until the demo XML fixture lands.
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!(await limiter.allow(ip))) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const parsed = Query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: 'invalid_domain' }, { status: 400 });

  try {
    const client = new ResellersPanelClient();
    const result = await client.checkAvail(parsed.data.domain.toLowerCase());
    return NextResponse.json({ ok: true, result });
  } catch {
    return NextResponse.json({ error: 'supplier_unavailable' }, { status: 502 });
  }
}
