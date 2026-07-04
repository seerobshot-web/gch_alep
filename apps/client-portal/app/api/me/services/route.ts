import { NextRequest, NextResponse } from 'next/server';
import { getClientOrders } from '@gch/fossbilling-client';

/** The FOSSBilling session cookie is forwarded from the browser as-is. */
export async function GET(req: NextRequest) {
  const cookie = req.headers.get('cookie');
  if (!cookie) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  try {
    const orders = await getClientOrders(cookie);
    return NextResponse.json({ ok: true, services: orders });
  } catch {
    return NextResponse.json({ error: 'forbidden' }, { status: 401 });
  }
}
