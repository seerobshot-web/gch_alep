import pino from 'pino';
import crypto from 'crypto';
import type { KVStore } from './kv';

export type { KVStore, KVValue } from './kv';

// NOTE: SqliteKV / UpstashKV / createKVStore are intentionally NOT
// re-exported here. kv-factory.ts reads @gch/config's env at import time,
// so pulling it into this package's root would force every consumer of
// `Provisioner` (including plain unit tests) to have a full environment
// configured. Import them from their own subpaths instead:
//   import { createKVStore } from '@gch/provisioning/kv-factory'

const log = pino({ name: 'gch:provisioning' });

export type ProvisionResult = {
  ok: boolean;
  supplier: string;
  supplier_service_id?: string | null;
  note?: string;
};

export type ProvisionOrderParams = {
  invoiceId: number;
  orderId: number;
  supplier: 'resellportal' | 'resellerspanel' | 'manual';
  supplierProductKey: string;
  clientEmail: string;
  orderConfig: Record<string, unknown>;
  resellPortalClient?: any;
  resellersPanelClient?: any;
  fossbillingClient?: any;
};

export class Provisioner {
  constructor(private kv: KVStore) {}

  private lockKey(orderId: number) {
    return `provisioning:${orderId}:lock`;
  }

  private provisionedKey(invoiceId: number, orderId: number) {
    return `provisioned:${invoiceId}:${orderId}`;
  }

  /**
   * Idempotent orchestration (CLAUDE.md rule 6).
   * - returns the stored supplier_service_id if a provisioned marker exists
   * - returns { ok:false, note: 'in_progress' } if a lock prevented start
   */
  async provisionOrder(params: ProvisionOrderParams): Promise<ProvisionResult> {
    const { invoiceId, orderId } = params;
    const provisionedKey = this.provisionedKey(invoiceId, orderId);

    // (a) if already provisioned, return stored id
    const existing = await this.kv.get(provisionedKey);
    if (existing) {
      log.info({ invoiceId, orderId }, 'already provisioned');
      return { ok: true, supplier: params.supplier, supplier_service_id: existing };
    }

    // (b) acquire lock (setNX)
    const lockKey = this.lockKey(orderId);
    const token = crypto.randomBytes(8).toString('hex');
    const locked = await this.kv.setNX(lockKey, token, 60);
    if (!locked) {
      log.info({ orderId }, 'lock present, in_progress');
      return { ok: false, supplier: params.supplier, note: 'in_progress' };
    }

    try {
      let serviceId: string | null = null;

      if (params.supplier === 'manual') {
        // manual fulfillment: create ticket, no service id
        serviceId = null;
      } else if (params.supplier === 'resellportal') {
        if (!params.resellPortalClient) throw new Error('resellPortalClient required');
        // ensureClient = lookup-by-email before create (CLAUDE.md rule 6)
        await params.resellPortalClient.ensureClient(params.clientEmail);
        const r = await params.resellPortalClient.createServiceOrder({
          product_key: params.supplierProductKey,
          config: params.orderConfig,
          test_mode: true
        });
        // adapter response shape is fixture-driven — see TODO-fixture stubs
        serviceId = r?.service_id ?? null;
      } else if (params.supplier === 'resellerspanel') {
        if (!params.resellersPanelClient) throw new Error('resellersPanelClient required');
        const r = await params.resellersPanelClient.createAccount({
          planid: params.supplierProductKey,
          data: params.orderConfig
        });
        serviceId = r?.service_id ?? null;
      }

      // (c) write provisioned marker BEFORE releasing lock
      await this.kv.set(provisionedKey, String(serviceId ?? 'null'), 60 * 60 * 24 * 30);

      // persist supplier_service_id back to FOSSBilling if a client was provided
      if (params.fossbillingClient && serviceId) {
        try {
          await params.fossbillingClient.updateOrderSupplierServiceId(params.orderId, String(serviceId));
        } catch (err) {
          log.error({ err }, 'Failed to persist supplier_service_id to FOSSBilling');
        }
      }

      return { ok: true, supplier: params.supplier, supplier_service_id: serviceId };
    } finally {
      // BUG FIX (#3): release the lock by deleting it, not by overwriting
      // it with a short TTL — overwrite-release is fragile (a slow deploy
      // or clock skew can leave a "released" value alive past intent).
      await this.kv.delete(lockKey);
    }
  }
}
