import { describe, it, expect, beforeEach, vi } from 'vitest';

const REQUIRED_ENV: Record<string, string> = {
  FOSSBILLING_URL: 'https://billing.example.com',
  FOSSBILLING_API_KEY: 'key',
  RESELLPORTAL_URL: 'https://resellportal.example.com/',
  RESELLPORTAL_KEY: 'rp-key',
  RESELLPORTAL_SECRET: 'rp-secret',
  RESELLERSPANEL_URL: 'https://resellerspanel.example.com',
  RESELLERSPANEL_KEY: 'key',
  RESELLERSPANEL_SECRET: 'secret',
  HOOK_SHARED_SECRET: 'secret',
  CRON_SECRET: 'secret',
  NEXT_PUBLIC_SITE_URL: 'https://gloryhosts.cloud'
};

function stubFetch(payload: unknown = {}) {
  const spy = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => payload });
  vi.stubGlobal('fetch', spy);
  return spy;
}

describe('ResellPortalClient (panel-verified surface)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    for (const [k, v] of Object.entries(REQUIRED_ENV)) process.env[k] = v;
  });

  it('authenticates every request with X-API-Key/X-API-Secret and strips trailing slash from base URL', async () => {
    const spy = stubFetch();
    const { ResellPortalClient } = await import('../src/client');
    await new ResellPortalClient().getBalance();

    const [url, init] = spy.mock.calls[0];
    expect(url).toBe('https://resellportal.example.com/balance');
    expect(init.headers['X-API-Key']).toBe('rp-key');
    expect(init.headers['X-API-Secret']).toBe('rp-secret');
  });

  it('createServiceOrder posts product_key, defaults skip_client_email on, and passes test_mode', async () => {
    const spy = stubFetch();
    const { ResellPortalClient } = await import('../src/client');
    await new ResellPortalClient().createServiceOrder({
      product_key: 'web_hosting',
      config: { primary_domain: 'example.org' },
      test_mode: true
    });

    const [url, init] = spy.mock.calls[0];
    expect(url).toBe('https://resellportal.example.com/orders');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body);
    expect(body.product_key).toBe('web_hosting');
    expect(body.primary_domain).toBe('example.org');
    expect(body.skip_client_email).toBe(true);
    expect(body.test_mode).toBe(true);
  });

  it('hits the verified category endpoints', async () => {
    const spy = stubFetch();
    const { ResellPortalClient } = await import('../src/client');
    const client = new ResellPortalClient();
    await client.getProducts();
    await client.getEsimPackages();
    await client.getSmmServices();
    await client.getVpnServers();

    const paths = spy.mock.calls.map(([url]) => new URL(url).pathname);
    expect(paths).toEqual(['/products', '/esim-packages', '/smm-services', '/vpn/servers']);
  });

  it('rule 4: deleteService refuses unless confirmDestroy exactly matches service_id', async () => {
    stubFetch();
    const { ResellPortalClient } = await import('../src/client');
    const client = new ResellPortalClient();
    await expect(client.deleteService({ service_id: 'svc-1', confirmDestroy: '' })).rejects.toThrow(/confirmDestroy/);
    await expect(client.deleteService({ service_id: 'svc-1', confirmDestroy: 'svc-2' })).rejects.toThrow(/confirmDestroy/);
  });

  it('throws on non-2xx responses with method and path context', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({}) }));
    const { ResellPortalClient } = await import('../src/client');
    await expect(new ResellPortalClient().getBalance()).rejects.toThrow('GET /balance failed: HTTP 401');
  });

  it('ensureClient stays fixture-gated (rule 5)', async () => {
    stubFetch();
    const { ResellPortalClient } = await import('../src/client');
    await expect(new ResellPortalClient().ensureClient('a@b.com')).rejects.toThrow(/TODO-FIXTURE/);
  });
});
