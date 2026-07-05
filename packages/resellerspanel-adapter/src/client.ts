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
      // Output is XML or PHP serialization only (no JSON) — we parse XML.
      return_type: 'xml',
      ...params
    };
    // Documented test switch is TEST_MODE=1 (demo mode itself is toggled
    // in Reseller CP → Remote Access; demo accepts any 15-digit card).
    if (this.demoMode) finalParams.TEST_MODE = 1;

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

  // ── VERIFIED command names (public API docs / vendor blog) ──────────
  // Response shapes remain TODO-fixture until demo-mode XML lands.

  /** Domain availability + current TLD price. Verified command: check_avail */
  async checkAvail(domain: string) {
    return this.sendCommand('check_avail', { domain }, { ttlSeconds: 300 });
  }

  /** Available data centers (needed when placing a hosting order). Verified command: get_datacenters */
  async getDatacenters(opts?: { ttlSeconds?: number }) {
    return this.sendCommand('get_datacenters', {}, { ttlSeconds: opts?.ttlSeconds ?? 3600 });
  }

  // ── UNVERIFIED command names — VERIFY-AGAINST-DOCS ──────────────────
  // These wrappers cover documented API *areas* (plan listing across all
  // four server lines, ordering, account status), but the exact command
  // strings below are placeholders from the original scaffold and were
  // NOT confirmed against the API PDF
  // (cp.resellerspanel.com/downloads/ResellersPanelAPI.pdf). Correct each
  // string from the PDF before any live call — commands are
  // case-sensitive and wrong names will error.

  /** VERIFY-AGAINST-DOCS: "Get offered plans" (cloud/shared hosting). */
  async listPlans(opts?: { ttlSeconds?: number }) {
    return this.sendCommand('listPlans', {}, { ttlSeconds: opts?.ttlSeconds ?? 300 });
  }

  /** VERIFY-AGAINST-DOCS: "Get offered Semi-dedicated plans". */
  async listSemiDedicatedPlans(opts?: { ttlSeconds?: number }) {
    return this.sendCommand('listSemiDedicatedPlans', {}, { ttlSeconds: opts?.ttlSeconds ?? 300 });
  }

  /** VERIFY-AGAINST-DOCS: "Get offered VPS plans" (KVM line; some OpenVZ setups remain). */
  async listVpsPlans(opts?: { ttlSeconds?: number }) {
    return this.sendCommand('listVpsPlans', {}, { ttlSeconds: opts?.ttlSeconds ?? 300 });
  }

  /** VERIFY-AGAINST-DOCS: "Get offered Dedicated servers". */
  async listDedicatedServers(opts?: { ttlSeconds?: number }) {
    return this.sendCommand('listDedicatedServers', {}, { ttlSeconds: opts?.ttlSeconds ?? 300 });
  }

  /** VERIFY-AGAINST-DOCS: "Get regular domain prices" / "Get TLD info". */
  async getDomainPrices(opts?: { ttlSeconds?: number }) {
    return this.sendCommand('getDomainPrices', {}, { ttlSeconds: opts?.ttlSeconds ?? 3600 });
  }

  /** VERIFY-AGAINST-DOCS: "Get SSL certificates prices". */
  async getSslPrices(opts?: { ttlSeconds?: number }) {
    return this.sendCommand('getSslPrices', {}, { ttlSeconds: opts?.ttlSeconds ?? 3600 });
  }

  /** VERIFY-AGAINST-DOCS: "Submit signup order" (hosting account creation). */
  async createAccount(params: Record<string, unknown>) {
    return this.sendCommand('createAccount', params, { ttlSeconds: 0 });
  }

  /** VERIFY-AGAINST-DOCS: "Submit domain order" (registration/transfer). */
  async submitDomainOrder(params: Record<string, unknown>) {
    return this.sendCommand('submitDomainOrder', params, { ttlSeconds: 0 });
  }

  /** VERIFY-AGAINST-DOCS: account status lookup. */
  async getAccountStatus(account: string) {
    return this.sendCommand('getAccountStatus', { account }, { ttlSeconds: 30 });
  }
}
