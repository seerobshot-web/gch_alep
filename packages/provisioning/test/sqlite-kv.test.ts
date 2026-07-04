import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { SqliteKV } from '../src/sqlite-kv';

describe('SqliteKV', () => {
  let dbPath: string;
  let kv: SqliteKV;

  beforeEach(() => {
    dbPath = path.join(os.tmpdir(), `gch-sqlite-kv-test-${process.hrtime.bigint()}.sqlite`);
    kv = new SqliteKV(dbPath);
  });

  afterEach(() => {
    fs.rmSync(dbPath, { force: true });
  });

  it('setNX succeeds when the key does not exist', async () => {
    expect(await kv.setNX('lock', 'token-1', 60)).toBe(true);
  });

  it('setNX fails while a live (non-expired) lock is held', async () => {
    await kv.setNX('lock', 'token-1', 60);
    expect(await kv.setNX('lock', 'token-2', 60)).toBe(false);
  });

  it('regression (bug #2): setNX succeeds when an EXPIRED lock row is still present', async () => {
    // ttlSeconds -1 -> expires_at is already in the past
    expect(await kv.setNX('lock', 'token-1', -1)).toBe(true);
    // a naive `INSERT OR IGNORE` would see the still-present expired row
    // and refuse to insert, deadlocking provisioning for this order
    expect(await kv.setNX('lock', 'token-2', 60)).toBe(true);
    expect(await kv.get('lock')).toBe('token-2');
  });

  it('get returns null and lazily clears an expired row', async () => {
    await kv.set('foo', 'bar', -1);
    expect(await kv.get('foo')).toBeNull();
  });

  it('delete removes the key', async () => {
    await kv.set('foo', 'bar');
    await kv.delete('foo');
    expect(await kv.get('foo')).toBeNull();
  });
});
