import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { KVStore } from '@gch/provisioning/kv';

const REQUIRED_ENV: Record<string, string> = {
  FOSSBILLING_URL: 'https://billing.example.com',
  FOSSBILLING_API_KEY: 'key',
  RESELLPORTAL_URL: 'https://resellportal.example.com',
  RESELLPORTAL_KEY: 'key',
  RESELLPORTAL_SECRET: 'secret',
  RESELLERSPANEL_URL: 'https://resellerspanel.example.com/api.php',
  RESELLERSPANEL_KEY: 'rp-key',
  RESELLERSPANEL_SECRET: 'rp-secret',
  RESELLERSPANEL_DEMO_MODE: 'true',
  HOOK_SHARED_SECRET: 'secret',
  CRON_SECRET: 'secret',
  NEXT_PUBLIC_SITE_URL: 'https://gloryhosts.cloud'
};

function createMockKV(): KVStore {
  const store = new Map<string, string>();
  return {
    get: async (k) => store.get(k) ?? null,
    set: async (k, v) => {
      store.set(k, v);
    },
    setNX: async (k, v) => {
      if (store.has(k)) return false;
      store.set(k, v);
      return true;
    },
    delete: async (k) => {
      store.delete(k);
    }
  };
}

describe('ResellersPanelClient', () => {
  beforeEach(() => {
    vi.resetModules();
    for (const [k, v] of Object.entries(REQUIRED_ENV)) process.env[k] = v;
  });

  it('sends demo=1 and return_type=xml as form fields in demo mode', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ text: async () => '<result><status>ok</status></result>' });
    vi.stubGlobal('fetch', fetchSpy);

    const { ResellersPanelClient } = await import('../src/client');
    const client = new ResellersPanelClient({ demoMode: true });
    await client.listPlans();

    const [, init] = fetchSpy.mock.calls[0];
    const sentBody = new URLSearchParams(init.body);
    expect(sentBody.get('command')).toBe('listPlans');
    expect(sentBody.get('return_type')).toBe('xml');
    expect(sentBody.get('demo')).toBe('1');
    expect(sentBody.get('api_key')).toBe('rp-key');

    vi.unstubAllGlobals();
  });

  it('caches a response in the injected KVStore and serves the second call from cache', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ text: async () => '<result><status>ok</status></result>' });
    vi.stubGlobal('fetch', fetchSpy);

    const { ResellersPanelClient } = await import('../src/client');
    const kv = createMockKV();
    const client = new ResellersPanelClient({ demoMode: true, kv });

    await client.listPlans({ ttlSeconds: 300 });
    await client.listPlans({ ttlSeconds: 300 });

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    vi.unstubAllGlobals();
  });

  it('never sends a plaintext command without demo=1 when demoMode is false', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ text: async () => '<result/>' });
    vi.stubGlobal('fetch', fetchSpy);

    const { ResellersPanelClient } = await import('../src/client');
    const client = new ResellersPanelClient({ demoMode: false });
    await client.checkDomain('example.com');

    const [, init] = fetchSpy.mock.calls[0];
    const sentBody = new URLSearchParams(init.body);
    expect(sentBody.has('demo')).toBe(false);

    vi.unstubAllGlobals();
  });
});
