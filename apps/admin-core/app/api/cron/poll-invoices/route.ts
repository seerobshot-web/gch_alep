import { NextRequest, NextResponse } from 'next/server';
import { env } from '@gch/config/env';
import { timingSafeEqual } from 'crypto';
import pino from 'pino';
// BUG FIX (#4): the KV backend comes from the factory — Upstash when
// KV_URL/KV_TOKEN are configured, SQLite (dev-only, loud warning)
// otherwise. Instantiating SqliteKV directly here meant idempotency
// markers lived on Vercel's per-invocation filesystem and vanished
// between cron runs: silent double-provisioning.
import { createKVStore } from '@gch/provisioning/kv-factory';
import { Provisioner } from '@gch/provisioning';
import { getRecentInvoices, getInvoice, getOrder, getProduct, getClient } from '@gch/fossbilling-client';
import { ResellPortalClient } from '@gch/resellportal-adapter';
import { ResellersPanelClient } from '@gch/resellerspanel-adapter';

const log = pino({ name: 'gch:cron' });

function authOk(header?: string | null) {
  if (!header) return false;
  const token = header.replace(/^Bearer\s+/i, '').trim();
  const a = Buffer.from(token);
  const b = Buffer.from(env.CRON_SECRET);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!authOk(auth)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const kv = createKVStore();
  const provisioner = new Provisioner(kv);
  const resellPortalClient = new ResellPortalClient();
  const resellersPanelClient = new ResellersPanelClient({ kv });

  const invoices = await getRecentInvoices({ minutes: 15 });
  const run: Array<{ invoiceId: number; orderId?: number; status: string }> = [];

  for (const inv of invoices) {
    if (inv.status !== 'paid') continue;
    try {
      const full = await getInvoice(inv.id);
      // VERIFY-AGAINST-INSTALL: confirm the shape linking an invoice to its
      // order ids once a real admin/invoice/get fixture is available.
      const orderIds: number[] = (full as any).order_ids ?? [];
      for (const oid of orderIds) {
        // INTEGRATION: resolve supplier routing from FOSSBilling instead of
        // the scaffold's hardcoded 'resellportal' / 'TODO' / fake email.
        const order = await getOrder(oid);
        const product = await getProduct(order.product_id);
        if (!product) {
          log.error({ oid, productId: order.product_id }, 'unknown product for order');
          run.push({ invoiceId: inv.id, orderId: oid, status: 'unknown_product' });
          continue;
        }
        const client = await getClient(order.client_id);

        const res = await provisioner.provisionOrder({
          invoiceId: inv.id,
          orderId: oid,
          supplier: product.config.supplier,
          supplierProductKey: product.config.supplier_product_key,
          clientEmail: client.email,
          orderConfig: order.order_config,
          resellPortalClient,
          resellersPanelClient
        });
        run.push({ invoiceId: inv.id, orderId: oid, status: res.ok ? 'ok' : res.note ?? 'failed' });
      }
    } catch (err) {
      log.error({ err, invoice: inv.id }, 'error provisioning invoice');
      run.push({ invoiceId: inv.id, status: 'error' });
    }
  }

  return NextResponse.json({ ok: true, processed: run });
}
