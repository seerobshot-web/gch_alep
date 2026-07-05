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

describe('env', () => {
  beforeEach(() => {
    vi.resetModules();
    for (const [k, v] of Object.entries(REQUIRED_ENV)) process.env[k] = v;
  });

  it('parses a valid environment into the typed env object', async () => {
    const { env } = await import('../src/env');
    expect(env.FOSSBILLING_URL).toBe(REQUIRED_ENV.FOSSBILLING_URL);
    expect(env.RESELLERSPANEL_DEMO_MODE).toBe('true');
    expect(env.SQLITE_PATH).toBe('./dev-data/kv.sqlite');
  });

  it('throws on first access when a required var is missing', async () => {
    delete process.env.CRON_SECRET;
    const { env } = await import('../src/env');
    expect(() => env.CRON_SECRET).toThrow();
  });
});
