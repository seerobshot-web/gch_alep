import { Redis } from '@upstash/redis';
import type { KVStore } from './kv';

/**
 * Production KVStore backed by Upstash's REST Redis API — durable across
 * serverless invocations, unlike SqliteKV (see kv-factory.ts / bug #4).
 */
export class UpstashKV implements KVStore {
  private client: Redis;

  constructor(opts: { url: string; token: string }) {
    this.client = new Redis({ url: opts.url, token: opts.token });
  }

  async get(key: string): Promise<string | null> {
    const value = await this.client.get<string>(key);
    return value ?? null;
  }

  async set(key: string, value: string, ttlSeconds?: number | null): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, { ex: ttlSeconds });
    } else {
      await this.client.set(key, value);
    }
  }

  async setNX(key: string, value: string, ttlSeconds?: number | null): Promise<boolean> {
    const result = ttlSeconds
      ? await this.client.set(key, value, { nx: true, ex: ttlSeconds })
      : await this.client.set(key, value, { nx: true });
    return result === 'OK';
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
