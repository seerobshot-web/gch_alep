import { describe, it, expect, beforeEach, vi } from 'vitest';

const REQUIRED_ENV: Record<string, string> = {
  FOSSBILLING_URL: 'https://billing.example.com',
  FOSSBILLING_API_KEY: 'key',
  RESELLPORTAL_URL: 'https://resellportal.example.com',
  RESELLPORTAL_KEY: 'key',
  RESELLPORTAL_SECRET: 'secret',
  RESELLERSPANEL_URL: 'https://resellerspanel.example.com',
  RESELLERSPANEL_KEY: 'key',
  RESELLERSPANEL_SECRET: 'secret',
  HOOK_SHARED_SECRET: 'secret',
  CRON_SECRET: 'secret',
  NEXT_PUBLIC_SITE_URL: 'https://gloryhosts.cloud'
};

const SAMPLE_PRODUCT = {
  id: 1,
  title: 'Starter Web Hosting',
  slug: 'starter-web-hosting',
  description: null,
  type: 'hosting',
  pricing: { monthly: 5 },
  config: {
    supplier: 'resellerspanel',
    supplier_product_key: 'shared-starter',
    upsell_ids: [],
    required_fields: [],
    manual_fulfillment: false
  }
};

describe('fossbilling-client (global fetch, bug #6 exports)', () => {
  beforeEach(() => {
    vi.resetModules();
    for (const [k, v] of Object.entries(REQUIRED_ENV)) process.env[k] = v;
  });

  it('invoicePaymentUrl builds a URL from env.FOSSBILLING_URL + invoice hash', async () => {
    const { invoicePaymentUrl } = await import('../src/client');
    const url = invoicePaymentUrl({
      id: 1,
      client_id: 1,
      status: 'unpaid',
      total: 10,
      currency: 'USD',
      hash: 'abc123',
      created_at: new Date().toISOString(),
      paid_at: null
    });
    expect(url).toBe('https://billing.example.com/invoice/abc123');
  });

  it('getProducts uses the global fetch (no node-fetch import) and parses the result', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      json: async () => ({ result: { list: [SAMPLE_PRODUCT] }, error: null }),
      headers: new Headers()
    });
    vi.stubGlobal('fetch', fetchSpy);

    const { getProducts } = await import('../src/client');
    const products = await getProducts();

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://billing.example.com/api/guest/product/get_list',
      expect.objectContaining({ method: 'POST' })
    );
    expect(products).toHaveLength(1);
    expect(products[0].slug).toBe('starter-web-hosting');

    vi.unstubAllGlobals();
  });

  it('throws FossbillingError when the API returns an error payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: async () => ({ result: null, error: { code: 403, message: 'nope' } }),
        headers: new Headers()
      })
    );

    const { getProducts, FossbillingError } = await import('../src/client');
    await expect(getProducts()).rejects.toBeInstanceOf(FossbillingError);

    vi.unstubAllGlobals();
  });
});
