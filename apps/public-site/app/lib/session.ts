import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';
import { env } from '@gch/config/env';

/**
 * First-party session cookie for public-site, scoped to gloryhosts.cloud
 * (CLAUDE.md domain topology: cookies are per-subdomain, httpOnly, Secure,
 * SameSite=Lax). Separate from the raw FOSSBilling session cookie, which
 * is issued for billing.gloryhosts.cloud and isn't valid across subdomains.
 *
 * The signature reuses HOOK_SHARED_SECRET rather than introducing a new
 * required env var; timingSafeEqual is used for the comparison per
 * CLAUDE.md rule 3.
 */
export const SESSION_COOKIE_NAME = 'gch_session';

function sign(value: string): string {
  return createHmac('sha256', env.HOOK_SHARED_SECRET).update(value).digest('hex');
}

export function createSessionCookieValue(clientId: number): string {
  const value = String(clientId);
  return `${value}.${sign(value)}`;
}

export async function getSessionClientId(req: NextRequest): Promise<number | null> {
  const raw = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) return null;

  const [value, signature] = raw.split('.');
  if (!value || !signature) return null;

  const expected = sign(value);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const clientId = Number(value);
  return Number.isInteger(clientId) ? clientId : null;
}
