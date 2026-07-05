import { NextRequest, NextResponse } from 'next/server';
import { CreateOrderInput, getProducts, createOrder, getInvoice, invoicePaymentUrl } from '@gch/fossbilling-client';
import { getSessionClientId } from '@/lib/session';

export async function POST(req: NextRequest) {
  const clientId = await getSessionClientId(req);
  if (!clientId) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const parsed = CreateOrderInput.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', issues: parsed.error.flatten() }, { status: 400 });
  }
  const { product_id, period, config, upsell_product_ids } = parsed.data;

  const catalog = await getProducts();
  const product = catalog.find((p) => p.id === product_id);
  if (!product) return NextResponse.json({ error: 'Unknown product' }, { status: 400 });

  const legalUpsells = new Set(product.config.upsell_ids ?? []);
  if (!upsell_product_ids.every((id) => legalUpsells.has(id))) {
    return NextResponse.json({ error: 'Invalid add-on selection' }, { status: 400 });
  }

  const missing = (product.config.required_fields ?? []).filter((f) => !config[f]);
  if (missing.length) {
    return NextResponse.json({ error: 'missing_fields', fields: missing }, { status: 400 });
  }

  const mainOrder = await createOrder({ client_id: clientId, product_id, period, config });
  for (const upsellId of upsell_product_ids) {
    await createOrder({ client_id: clientId, product_id: upsellId, period, config: {} });
  }

  // Best-effort invoice lookup — adapt once a real FOSSBilling order/create fixture is attached
  const invoiceCandidateId = (mainOrder as any).invoice_id ?? (mainOrder as any).invoice ?? mainOrder.id;
  try {
    const invoice = await getInvoice(Number(invoiceCandidateId));
    return NextResponse.json({ payment_url: invoicePaymentUrl(invoice) });
  } catch {
    return NextResponse.json({ error: 'invoice_not_found' }, { status: 500 });
  }
}
