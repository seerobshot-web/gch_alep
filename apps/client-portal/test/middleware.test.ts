import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '../middleware';

describe('client-portal middleware (bug #1 regression: app-root placement)', () => {
  it('returns 404 for a host outside my.gloryhosts.cloud', () => {
    const res = middleware(new NextRequest('https://gloryhosts.cloud/'));
    expect(res.status).toBe(404);
  });

  it('passes through and sets security headers for my.gloryhosts.cloud', () => {
    const res = middleware(new NextRequest('https://my.gloryhosts.cloud/'));
    expect(res.status).toBe(200);
    expect(res.headers.get('x-frame-options')).toBe('DENY');
  });
});
