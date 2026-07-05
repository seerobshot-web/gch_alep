import 'server-only';
import { env } from '@gch/config/env';
import type { ResellPortalBalanceStub } from './schemas';

/**
 * Server-only ResellPortal client (CLAUDE.md rule 2). Only this module
 * reads ResellPortal keys via @gch/config — they never leave this package.
 *
 * Endpoint surface is FIRST-PARTY VERIFIED against the panel's API
 * Access documentation (2026-07-05): auth via X-API-Key/X-API-Secret
 * headers; base panel.resellportal.com/wp-json/resellportal/v1.
 *
 * Documented global flags:
 * - test_mode: true (body) or X-RP-Test-Mode: 1 (header) — validates the
 *   integration without touching the wallet on POST /orders, POST
 *   /clients, DELETE /clients/{id}, DELETE /services/{id}; returns a
 *   realistic mock ("test_svc_"/"test_cli_"-prefixed ids, would_charge).
 * - skip_client_email: true on any order request — suppresses the
 *   supplier's welcome email; response still carries credentials so our
 *   own mail flow delivers them.
 *
 * Response BODY shapes remain fixture-gated (CLAUDE.md rule 5): methods
 * return `unknown` until sanitized fixtures land in fixtures/ and zod
 * schemas replace the stubs in schemas.ts.
 */
export class ResellPortalClient {
  baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = env.RESELLPORTAL_URL.replace(/\/+$/, '');
    this.headers = {
      'Content-Type': 'application/json',
      'X-API-Key': env.RESELLPORTAL_KEY,
      'X-API-Secret': env.RESELLPORTAL_SECRET
    };
  }

  private async request<T = unknown>(
    method: 'GET' | 'POST' | 'DELETE',
    path: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) {
      throw new Error(`ResellPortal ${method} ${path} failed: HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  }

  // ── Account ──────────────────────────────────────────────────────────

  /** GET /balance — wallet balance. */
  async getBalance(): Promise<ResellPortalBalanceStub> {
    return this.request('GET', '/balance');
  }

  /** GET /products — the authoritative product_key vocabulary + pricing. */
  async getProducts(): Promise<unknown> {
    return this.request('GET', '/products');
  }

  // ── Clients ──────────────────────────────────────────────────────────

  /** GET /clients — list all clients. */
  async listClients(): Promise<unknown> {
    return this.request('GET', '/clients');
  }

  /** GET /clients/{id} — single client details. */
  async getClient(clientId: string | number): Promise<unknown> {
    return this.request('GET', `/clients/${encodeURIComponent(String(clientId))}`);
  }

  /** POST /clients — create a client. */
  async createClient(payload: Record<string, unknown>, opts?: { testMode?: boolean }): Promise<unknown> {
    return this.request('POST', '/clients', {
      ...payload,
      ...(opts?.testMode ? { test_mode: true } : {})
    });
  }

  /**
   * CLAUDE.md rule 6: lookup-by-email before create. List-response shape
   * is fixture-gated — this refuses to guess field names until the
   * sanitized GET /clients fixture defines the match key.
   */
  async ensureClient(_email: string): Promise<never> {
    throw new Error(
      'TODO-FIXTURE: ensureClient needs the sanitized GET /clients fixture to define the email match field'
    );
  }

  // ── Services & orders ────────────────────────────────────────────────

  /** GET /services — list all services. */
  async listServices(): Promise<unknown> {
    return this.request('GET', '/services');
  }

  /** GET /services/{id} — single service details. */
  async getService(serviceId: string): Promise<unknown> {
    return this.request('GET', `/services/${encodeURIComponent(serviceId)}`);
  }

  /** GET /orders — list orders (filter params fixture-gated). */
  async listOrders(params?: Record<string, string>): Promise<unknown> {
    const qs = params ? `?${new URLSearchParams(params)}` : '';
    return this.request('GET', `/orders${qs}`);
  }

  /**
   * POST /orders — create an order/subscription. product_key values are
   * supplier-defined (confirmed so far: web_hosting, invoice_ai); the
   * full vocabulary comes from GET /products. Per-product body fields
   * (e.g. cpanel_username, primary_domain, billing_cycle) ride in
   * `config`. skip_client_email defaults ON: GCH owns client comms.
   */
  async createServiceOrder(opts: {
    product_key: string;
    config: Record<string, unknown>;
    test_mode?: boolean;
    skip_client_email?: boolean;
  }): Promise<unknown> {
    return this.request('POST', '/orders', {
      product_key: opts.product_key,
      ...opts.config,
      skip_client_email: opts.skip_client_email ?? true,
      ...(opts.test_mode ? { test_mode: true } : {})
    });
  }

  // ── Category endpoints ───────────────────────────────────────────────

  /** GET /esim-packages — available eSIM packages. */
  async getEsimPackages(): Promise<unknown> {
    return this.request('GET', '/esim-packages');
  }

  /** GET /smm-services — available SMM services. */
  async getSmmServices(): Promise<unknown> {
    return this.request('GET', '/smm-services');
  }

  /** GET /vpn/servers — VPN server locations (82+, WireGuard/OpenVPN). */
  async getVpnServers(): Promise<unknown> {
    return this.request('GET', '/vpn/servers');
  }

  /** GET /vpn/ports — OpenVPN ports. */
  async getVpnPorts(): Promise<unknown> {
    return this.request('GET', '/vpn/ports');
  }

  /** GET /vpn/config — WireGuard/OpenVPN config for a VPN subscription (params fixture-gated). */
  async getVpnConfig(params?: Record<string, string>): Promise<unknown> {
    const qs = params ? `?${new URLSearchParams(params)}` : '';
    return this.request('GET', `/vpn/config${qs}`);
  }

  // ── Destructive (rule 4) ─────────────────────────────────────────────

  /**
   * DELETE /services/{id} — IRREVERSIBLE after ~5s (CLAUDE.md rule 4).
   * Never reachable from any UI. confirmDestroy must equal the service id
   * exactly; the FOSSBilling module additionally enforces the 7-day
   * suspended grace period before anything calls this.
   */
  async deleteService(opts: { service_id: string; confirmDestroy: string; test_mode?: boolean }): Promise<unknown> {
    if (!opts.confirmDestroy || opts.confirmDestroy !== opts.service_id) {
      throw new Error('confirmDestroy must exactly match service_id');
    }
    return this.request('DELETE', `/services/${encodeURIComponent(opts.service_id)}`, {
      ...(opts.test_mode ? { test_mode: true } : {})
    });
  }
}
