import { NextRequest, NextResponse } from 'next/server';
import { env } from '@gch/config/env';
import { timingSafeEqual } from 'crypto';
import pino from 'pino';
import { z } from 'zod';

const log = pino({ name: 'gch:hooks' });

const HookBody = z.object({
  event: z.string().optional(),
  params: z.record(z.string(), z.unknown()).optional()
});

function secretOk(header?: string | null) {
  if (!header) return false;
  const a = Buffer.from(header.trim());
  const b = Buffer.from(env.HOOK_SHARED_SECRET);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-gch-hook-secret');
  if (!secretOk(secret)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const parsed = HookBody.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  log.info({ event: parsed.data.event }, 'received FOSSBilling hook');

  // For now: accept + 200 and let the cron pick up invoice changes;
  // production: enqueue a background job that calls the provisioner.
  return NextResponse.json({ ok: true });
}
