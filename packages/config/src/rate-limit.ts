/**
 * Shared sliding-window rate limiter. Default backend is an in-memory Map
 * (per-process — fine for a single Next.js server instance / local dev).
 * Pass a KVStore-shaped backend for multi-instance deployments.
 *
 * Usage:
 *   const rl = createRateLimiter({ windowMs: 60000, max: 5 });
 *   if (!(await rl.allow(ip))) return 429
 */

export interface RateLimitBackend {
  get(key: string): Promise<string | null> | string | null;
  set(key: string, value: string, ttlSeconds?: number | null): Promise<void> | void;
}

type Entry = { count: number; firstAt: number };

function createMemoryBackend(): RateLimitBackend {
  const store = new Map<string, Entry>();
  return {
    get(key) {
      const e = store.get(key);
      return e ? JSON.stringify(e) : null;
    },
    set(key, value) {
      store.set(key, JSON.parse(value));
    }
  };
}

export function createRateLimiter({
  windowMs = 60000,
  max = 5,
  backend
}: { windowMs?: number; max?: number; backend?: RateLimitBackend } = {}) {
  const store = backend ?? createMemoryBackend();

  return {
    async allow(key: string): Promise<boolean> {
      const now = Date.now();
      const raw = await store.get(key);
      const e: Entry | null = raw ? JSON.parse(raw) : null;

      if (!e || now - e.firstAt > windowMs) {
        await store.set(key, JSON.stringify({ count: 1, firstAt: now }), Math.ceil(windowMs / 1000));
        return true;
      }
      if (e.count >= max) return false;
      await store.set(key, JSON.stringify({ count: e.count + 1, firstAt: e.firstAt }), Math.ceil(windowMs / 1000));
      return true;
    }
  };
}
