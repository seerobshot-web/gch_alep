import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import type { KVStore } from './kv';

interface KVRow {
  value: string;
  expires_at: number | null;
}

/**
 * Local-dev-only KVStore backed by SQLite. Never used in production — the
 * filesystem on Vercel is ephemeral per-invocation, so idempotency markers
 * would vanish between cron runs (see kv-factory.ts).
 */
export class SqliteKV implements KVStore {
  private db: Database.Database;

  constructor(dbPath: string) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    this.db = new Database(dbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS kv (
        key TEXT PRIMARY KEY,
        value TEXT,
        expires_at INTEGER
      )
    `);
  }

  async get(key: string): Promise<string | null> {
    const row = this.db.prepare('SELECT value, expires_at FROM kv WHERE key = ?').get(key) as KVRow | undefined;
    if (!row) return null;
    if (row.expires_at && Date.now() > row.expires_at) {
      this.db.prepare('DELETE FROM kv WHERE key = ?').run(key);
      return null;
    }
    return row.value;
  }

  async set(key: string, value: string, ttlSeconds?: number | null): Promise<void> {
    const expires_at = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.db
      .prepare(
        `INSERT INTO kv (key, value, expires_at) VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, expires_at = excluded.expires_at`
      )
      .run(key, value, expires_at);
  }

  async setNX(key: string, value: string, ttlSeconds?: number | null): Promise<boolean> {
    const expires_at = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;

    // BUG FIX (#2): INSERT OR IGNORE alone returns false if an EXPIRED row
    // still occupies the primary key, permanently deadlocking provisioning
    // for that order. Clear out expired rows for this key first so an
    // expired lock never blocks a fresh acquire.
    this.db
      .prepare('DELETE FROM kv WHERE key = ? AND expires_at IS NOT NULL AND expires_at < ?')
      .run(key, Date.now());

    const info = this.db
      .prepare('INSERT OR IGNORE INTO kv (key, value, expires_at) VALUES (?, ?, ?)')
      .run(key, value, expires_at);
    return info.changes > 0;
  }

  async delete(key: string): Promise<void> {
    this.db.prepare('DELETE FROM kv WHERE key = ?').run(key);
  }
}
