import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

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

describe('public-site middleware (bug #1 regression: app-root placement)', () => {
  beforeEach(() => {
    for (const [k, v] of Object.entries(REQUIRED_ENV)) process.env[k] = v;
  });

  it('returns 404 for a host outside gloryhosts.cloud', async () => {
    const { middleware } = await import('../middleware');
    const res = middleware(new NextRequest('https://evil.example.com/'));
    expect(res.status).toBe(404);
  });

  it('passes through and sets security headers for gloryhosts.cloud', async () => {
    const { middleware } = await import('../middleware');
    const res = middleware(new NextRequest('https://gloryhosts.cloud/'));
    expect(res.status).toBe(200);
    expect(res.headers.get('x-frame-options')).toBe('DENY');
    expect(res.headers.get('content-security-policy')).toContain('billing.example.com');
  });
});
