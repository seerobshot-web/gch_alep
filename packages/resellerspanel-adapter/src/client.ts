import 'server-only';
import { XMLParser } from 'fast-xml-parser';
import { env } from '@gch/config/env';
import type { KVStore } from '@gch/provisioning/kv';

/**
 * ResellersPanel XML command API client (CLAUDE.md rule 2: server-only).
 * - return_type=xml enforced
 * - case-sensitive params preserved
 * - TTL caching via an injected KVStore
 * - demoMode toggles demo behavior (no live wallet/retained-customer
 *   requirement while fixtures are being sanitized)
 * Response validation is left as TODO-fixture until demo XML fixtures land.
 */
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });

export class ResellersPanelClient {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
  kv: KVStore | null;
  demoMode: boolean;

  constructor(opts: { kv?: KVStore | null; demoMode?: boolean } = {}) {
    this.baseUrl = env.RESELLERSPANEL_URL;
    this.apiKey = env.RESELLERSPANEL_KEY;
    this.apiSecret = env.RESELLERSPANEL_SECRET;
    this.kv = opts.kv ?? null;
    this.demoMode = opts.demoMode ?? env.RESELLERSPANEL_DEMO_MODE === 'true';
  }

  private buildForm(params: Record<string, unknown>): string {
    const u = new URLSearchParams();
    for (const k of Object.keys(params)) {
      const v = params[k];
      if (v === undefined || v === null) continue;
      u.append(k, String(v));
    }
    return u.toString();
  }

  private cacheKey(command: string, params: Record<string, unknown>): string {
    const keys = Object.keys(params).sort();
    return `${command}?${keys.map((k) => `${k}=${String(params[k])}`).join('&')}`;
  }

  async sendCommand<T = unknown>(
    command: string,
    params: Record<string, unknown> = {},
    opts?: { ttlSeconds?: number }
  ): Promise<T> {
    const finalParams: Record<string, unknown> = {
      command,
      api_key: this.apiKey,
      api_secret: this.apiSecret,
      return_type: 'xml',
      ...params
    };
    if (this.demoMode) finalParams.demo = 1;

    const key = this.cacheKey(command, finalParams);
    const ttl = opts?.ttlSeconds ?? 0;
    if (ttl && this.kv) {
      const cached = await this.kv.get(key);
      if (cached) return JSON.parse(cached) as T;
    }

    const body = this.buildForm(finalParams);
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    const text = await res.text();
    const parsed = parser.parse(text) as T;

    if (ttl && this.kv) await this.kv.set(key, JSON.stringify(parsed), ttl);
    return parsed;
  }

  async listPlans(opts?: { ttlSeconds?: number }) {
    return this.sendCommand('listPlans', {}, { ttlSeconds: opts?.ttlSeconds ?? 300 });
  }

  async checkDomain(domain: string) {
    return this.sendCommand('checkdomain', { domain }, { ttlSeconds: 300 });
  }

  async createAccount(params: Record<string, unknown>) {
    return this.sendCommand('createAccount', params, { ttlSeconds: 0 });
  }

  async getAccountStatus(account: string) {
    return this.sendCommand('getAccountStatus', { account }, { ttlSeconds: 30 });
  }
}
