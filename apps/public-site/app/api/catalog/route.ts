import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CATALOG, productsByCategory } from '@/lib/catalog';

const Query = z.object({
  category: z.enum(['hosting', 'vps', 'domains', 'ai-tools', 'vpn', 'saas', 'services']).optional()
});

/** Static marketing catalog (see app/lib/catalog.ts) — not supplier API data. */
export async function GET(req: NextRequest) {
  const parsed = Query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: 'invalid_category' }, { status: 400 });

  const products = parsed.data.category ? productsByCategory(parsed.data.category) : CATALOG;
  return NextResponse.json({ products }, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600' } });
}
