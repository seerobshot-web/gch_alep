import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

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

describe('createKVStore (bug #4 fix)', () => {
  let sqlitePath: string;

  beforeEach(() => {
    vi.resetModules();
    for (const [k, v] of Object.entries(REQUIRED_ENV)) process.env[k] = v;
    sqlitePath = path.join(os.tmpdir(), `gch-kv-factory-test-${process.hrtime.bigint()}.sqlite`);
    process.env.SQLITE_PATH = sqlitePath;
    delete process.env.KV_URL;
    delete process.env.KV_TOKEN;
  });

  afterEach(() => {
    fs.rmSync(sqlitePath, { force: true });
    vi.restoreAllMocks();
  });

  it('falls back to SqliteKV and warns loudly when KV_URL/KV_TOKEN are unset', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { createKVStore } = await import('../src/kv-factory');
    const { SqliteKV } = await import('../src/sqlite-kv');

    const store = createKVStore();

    expect(store).toBeInstanceOf(SqliteKV);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/DEV-ONLY/);
  });

  it('selects UpstashKV when KV_URL and KV_TOKEN are both set', async () => {
    process.env.KV_URL = 'https://upstash.example.com';
    process.env.KV_TOKEN = 'upstash-token';
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { createKVStore } = await import('../src/kv-factory');
    const { UpstashKV } = await import('../src/upstash-kv');

    const store = createKVStore();

    expect(store).toBeInstanceOf(UpstashKV);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
