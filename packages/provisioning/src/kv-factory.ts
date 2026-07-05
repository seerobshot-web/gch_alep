import { env } from '@gch/config/env';
import type { KVStore } from './kv';
import { SqliteKV } from './sqlite-kv';
import { UpstashKV } from './upstash-kv';

/**
 * BUG FIX (#4): the cron route used to instantiate SqliteKV on every
 * request. On Vercel the filesystem is ephemeral and per-invocation, so
 * idempotency markers vanished between cron runs — a silent
 * double-provisioning risk. This factory picks a durable KV backend
 * whenever one is configured, and only falls back to SQLite (loudly) for
 * local development.
 */
export function createKVStore(): KVStore {
  if (env.KV_URL && env.KV_TOKEN) {
    return new UpstashKV({ url: env.KV_URL, token: env.KV_TOKEN });
  }
  // eslint-disable-next-line no-console
  console.warn(
    '[@gch/provisioning] KV_URL/KV_TOKEN not set — falling back to SqliteKV. ' +
      'This is DEV-ONLY: on Vercel the filesystem is ephemeral and idempotency markers will be lost between invocations.'
  );
  return new SqliteKV(env.SQLITE_PATH);
}
