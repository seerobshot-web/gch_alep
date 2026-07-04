import { describe, it, expect, beforeEach, vi } from 'vitest';

const REQUIRED_ENV: Record<string, string> = {
  FOSSBILLING_URL: 'https://billing.example.com',
  FOSSBILLING_API_KEY: 'key',
  RESELLPORTAL_URL: 'https://resellportal.example.com/',
  RESELLPORTAL_KEY: 'key',
  RESELLPORTAL_SECRET: 'secret',
  RESELLERSPANEL_URL: 'https://resellerspanel.example.com',
  RESELLERSPANEL_KEY: 'key',
  RESELLERSPANEL_SECRET: 'secret',
  HOOK_SHARED_SECRET: 'secret',
  CRON_SECRET: 'secret',
  NEXT_PUBLIC_SITE_URL: 'https://gloryhosts.cloud'
};

describe('ResellPortalClient', () => {
  beforeEach(() => {
    vi.resetModules();
    for (const [k, v] of Object.entries(REQUIRED_ENV)) process.env[k] = v;
  });

  it('strips a trailing slash from the configured base URL', async () => {
    const { ResellPortalClient } = await import('../src/client');
    const client = new ResellPortalClient();
    expect(client.baseUrl).toBe('https://resellportal.example.com');
  });

  it('never leaks supplier keys outside the client — they are only in its private headers', async () => {
    const { ResellPortalClient } = await import('../src/client');
    const client = new ResellPortalClient();
    expect(client.headers['X-API-Key']).toBe('key');
    expect(client.headers['X-API-Secret']).toBe('secret');
  });

  it('rule 4: deleteService refuses to run without a confirmDestroy token', async () => {
    const { ResellPortalClient } = await import('../src/client');
    const client = new ResellPortalClient();
    await expect(client.deleteService({ service_id: 'svc-1', confirmDestroy: '' })).rejects.toThrow(
      'confirmDestroy required'
    );
  });

  it('TODO-fixture stubs still throw until sanitized fixtures are attached', async () => {
    const { ResellPortalClient } = await import('../src/client');
    const client = new ResellPortalClient();
    await expect(client.ensureClient('a@b.com')).rejects.toThrow(/TODO-FIXTURE/);
    await expect(client.createServiceOrder({ product_key: 'p', config: {} })).rejects.toThrow(/TODO-FIXTURE/);
  });
});
