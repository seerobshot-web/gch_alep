import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRateLimiter } from '../src/rate-limit';

describe('createRateLimiter', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests under the max within the window', async () => {
    const rl = createRateLimiter({ windowMs: 60000, max: 2 });
    expect(await rl.allow('ip1')).toBe(true);
    expect(await rl.allow('ip1')).toBe(true);
  });

  it('blocks requests once max is exceeded', async () => {
    const rl = createRateLimiter({ windowMs: 60000, max: 1 });
    expect(await rl.allow('ip2')).toBe(true);
    expect(await rl.allow('ip2')).toBe(false);
  });

  it('tracks keys independently', async () => {
    const rl = createRateLimiter({ windowMs: 60000, max: 1 });
    expect(await rl.allow('a')).toBe(true);
    expect(await rl.allow('b')).toBe(true);
  });

  it('resets the count after the window elapses', async () => {
    vi.useFakeTimers();
    const rl = createRateLimiter({ windowMs: 1000, max: 1 });
    expect(await rl.allow('c')).toBe(true);
    expect(await rl.allow('c')).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(await rl.allow('c')).toBe(true);
  });

  it('supports a pluggable backend', async () => {
    const store = new Map<string, string>();
    const backend = {
      get: (key: string) => store.get(key) ?? null,
      set: (key: string, value: string) => {
        store.set(key, value);
      }
    };
    const rl = createRateLimiter({ windowMs: 60000, max: 1, backend });
    expect(await rl.allow('d')).toBe(true);
    expect(await rl.allow('d')).toBe(false);
    expect(store.has('d')).toBe(true);
  });
});
