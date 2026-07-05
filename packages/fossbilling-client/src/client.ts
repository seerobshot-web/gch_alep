import 'server-only';
import { env } from '@gch/config/env';
import { z } from 'zod';
import { Product, Client, Order, Invoice } from './schemas';

// Node 18+ ships a global fetch — node-fetch is unnecessary and was removed.

export class FossbillingError extends Error {
  constructor(
    public code: number | null,
    message: string
  ) {
    super(message);
    this.name = 'FossbillingError';
  }
}

async function call<T>(
  role: 'guest' | 'client' | 'admin',
  path: string,
  body: Record<string, unknown> = {},
  opts: { sessionCookie?: string } = {}
): Promise<{ result: T; setCookie?: string }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (role === 'admin') {
    headers['Authorization'] = 'Basic ' + Buffer.from(`admin:${env.FOSSBILLING_API_KEY}`).toString('base64');
  }
  if (opts.sessionCookie) headers['Cookie'] = opts.sessionCookie;

  const res = await fetch(`${env.FOSSBILLING_URL}/api/${role}/${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    cache: 'no-store'
  });
  const json = (await res.json()) as { result: T; error: { code: number; message: string } | null };
  if (json.error) throw new FossbillingError(json.error.code, json.error.message);
  return { result: json.result, setCookie: res.headers.get('set-cookie') ?? undefined };
}

export async function getProducts(): Promise<Product[]> {
  const { result } = await call<{ list: unknown[] }>('guest', 'product/get_list', { per_page: 100 });
  return z.array(Product).parse(result.list);
}

export async function getProduct(id: number): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) ?? null;
}

export async function createClient(input: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company?: string;
}): Promise<Client> {
  const { result } = await call<unknown>('admin', 'client/create', input);
  return Client.parse(result);
}

/** VERIFY-AGAINST-INSTALL: confirm 'client/get' is the correct admin API method once FOSSBilling is installed. */
export async function getClient(clientId: number): Promise<Client> {
  const { result } = await call<unknown>('admin', 'client/get', { id: clientId });
  return Client.parse(result);
}

export async function clientLogin(email: string, password: string): Promise<{ client: Client; sessionCookie: string }> {
  const { result, setCookie } = await call<unknown>('guest', 'client/login', { email, password });
  if (!setCookie) throw new FossbillingError(null, 'Login succeeded but no session cookie returned');
  return { client: Client.parse(result), sessionCookie: setCookie };
}

export async function createOrder(input: {
  client_id: number;
  product_id: number;
  period: string;
  config: Record<string, string>;
}): Promise<Order> {
  const { result } = await call<unknown>('admin', 'order/create', {
    client_id: input.client_id,
    id: input.product_id,
    period: input.period,
    config: input.config,
    invoice_option: 'issue-invoice'
  });
  return Order.parse(result);
}

/** VERIFY-AGAINST-INSTALL: confirm 'order/get' is the correct admin API method once FOSSBilling is installed. */
export async function getOrder(orderId: number): Promise<Order> {
  const { result } = await call<unknown>('admin', 'order/get', { id: orderId });
  return Order.parse(result);
}

export async function getInvoice(id: number): Promise<Invoice> {
  const { result } = await call<unknown>('admin', 'invoice/get', { id });
  return Invoice.parse(result);
}

export function invoicePaymentUrl(invoice: Invoice): string {
  return `${env.FOSSBILLING_URL}/invoice/${invoice.hash}`;
}

/**
 * VERIFY-AGAINST-INSTALL: FOSSBilling's admin API does not document a
 * dedicated "recent invoices" call. The closest known method is
 * `invoice/get_list`, which supports pagination but its exact filter
 * params for "paid since a timestamp" must be confirmed against a live
 * FOSSBilling install before this is wired to real polling. Until then
 * this filters get_list's results in-memory by `paid_at`.
 */
export async function getRecentInvoices(opts?: { minutes?: number }): Promise<Invoice[]> {
  const minutes = opts?.minutes ?? 15;
  const sinceMs = Date.now() - minutes * 60 * 1000;
  const { result } = await call<{ list: unknown[] }>('admin', 'invoice/get_list', { per_page: 100 });
  const invoices = z.array(Invoice).parse(result.list);
  return invoices.filter((inv) => inv.status === 'paid' && inv.paid_at && Date.parse(inv.paid_at) >= sinceMs);
}

export async function getClientOrders(sessionCookie: string): Promise<Order[]> {
  const { result } = await call<{ list: unknown[] }>('client', 'order/get_list', {}, { sessionCookie });
  return z.array(Order).parse(result.list);
}

export async function getClientInvoices(sessionCookie: string): Promise<Invoice[]> {
  const { result } = await call<{ list: unknown[] }>('client', 'invoice/get_list', {}, { sessionCookie });
  return z.array(Invoice).parse(result.list);
}

/** VERIFY-AGAINST-INSTALL: persisting the supplier service id likely needs a custom FOSSBilling module/API method; placeholder no-op until that module exists. */
export async function updateOrderSupplierServiceId(_orderId: number, _serviceId: string): Promise<boolean> {
  return true;
}
