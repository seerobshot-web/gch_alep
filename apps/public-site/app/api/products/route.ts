import { NextResponse } from 'next/server';
import { getProducts } from '@gch/fossbilling-client';

// Always execute at request time — this proxies live FOSSBilling data and
// must never be statically prerendered at build.
export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products }, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=300' } });
}
