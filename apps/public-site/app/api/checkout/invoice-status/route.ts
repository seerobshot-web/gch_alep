import { NextRequest, NextResponse } from 'next/server';
import { getInvoice } from '@gch/fossbilling-client';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  try {
    const invoice = await getInvoice(Number(id));
    return NextResponse.json({ ok: true, invoice });
  } catch {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
}
