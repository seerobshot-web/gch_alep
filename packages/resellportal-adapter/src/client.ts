import 'server-only';
import { env } from '@gch/config/env';
import type { ResellPortalProductStub, ResellPortalBalanceStub } from './schemas';

/**
 * Server-only ResellPortal client (CLAUDE.md rule 2). Only this module
 * reads ResellPortal keys via @gch/config — they never leave this package.
 * Methods are TODO-fixture stubs until sanitized responses are supplied.
 */
export class ResellPortalClient {
  baseUrl: string;
  headers: Record<string, string>;

  constructor() {
    this.baseUrl = env.RESELLPORTAL_URL.replace(/\/+$/, '');
    this.headers = {
      'Content-Type': 'application/json',
      'X-API-Key': env.RESELLPORTAL_KEY,
      'X-API-Secret': env.RESELLPORTAL_SECRET
    };
  }

  async getBalance(): Promise<ResellPortalBalanceStub> {
    const res = await fetch(`${this.baseUrl}/balance`, { headers: this.headers });
    return res.json();
  }

  async getProducts(): Promise<ResellPortalProductStub[]> {
    const res = await fetch(`${this.baseUrl}/products`, { headers: this.headers });
    const json = await res.json();
    // TODO-FIXTURE: validate with zod once sanitized fixtures are attached
    return json.products ?? json;
  }

  /** CLAUDE.md rule 6: lookup-by-email before create. */
  async ensureClient(_email: string): Promise<never> {
    throw new Error('TODO-FIXTURE: implement ensureClient once sanitized response fixtures are attached');
  }

  async createServiceOrder(_opts: { product_key: string; config: Record<string, unknown>; test_mode?: boolean }): Promise<never> {
    throw new Error('TODO-FIXTURE: implement createServiceOrder once sanitized response fixtures are attached');
  }

  /**
   * CLAUDE.md rule 4: NO service-deletion action anywhere in the UI.
   * ResellPortal's DELETE /services/{id} is irreversible after ~5s, so this
   * requires an explicit confirmDestroy token even at the adapter layer —
   * it must never be reachable from a bare "cancel" click.
   */
  async deleteService(opts: { service_id: string; confirmDestroy: string }): Promise<never> {
    if (!opts.confirmDestroy) throw new Error('confirmDestroy required');
    throw new Error('TODO-FIXTURE: implement deleteService once sanitized response fixtures are attached');
  }
}
