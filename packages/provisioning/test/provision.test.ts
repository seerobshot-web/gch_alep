import { describe, it, expect, vi } from 'vitest';
import { Provisioner } from '../src/index';
import type { KVStore } from '../src/kv';

function createMockKV(): KVStore {
  const store = new Map<string, string>();
  return {
    get: async (k) => store.get(k) ?? null,
    set: async (k, v) => {
      store.set(k, v);
    },
    setNX: async (k, v) => {
      if (store.has(k)) return false;
      store.set(k, v);
      return true;
    },
    delete: async (k) => {
      store.delete(k);
    }
  };
}

describe('Provisioner', () => {
  it('returns the stored supplier_service_id if a provisioned marker exists', async () => {
    const kv = createMockKV();
    await kv.set('provisioned:10:20', 'svc-1');
    const p = new Provisioner(kv);
    const res = await p.provisionOrder({
      invoiceId: 10,
      orderId: 20,
      supplier: 'resellportal',
      supplierProductKey: 'p1',
      clientEmail: 'a@b.c',
      orderConfig: {},
      resellPortalClient: { ensureClient: vi.fn(), createServiceOrder: vi.fn() }
    });
    expect(res.ok).toBe(true);
    expect(res.supplier_service_id).toBe('svc-1');
  });

  it('returns in_progress when a lock is already held', async () => {
    const kv = createMockKV();
    await kv.set('provisioning:30:lock', 'token');
    const p = new Provisioner(kv);
    const r = await p.provisionOrder({
      invoiceId: 30,
      orderId: 30,
      supplier: 'manual',
      supplierProductKey: '',
      clientEmail: 'x@y.z',
      orderConfig: {}
    });
    expect(r.ok).toBe(false);
    expect(r.note).toBe('in_progress');
  });

  it('BUG FIX #3: releases the lock via delete after a successful run', async () => {
    const kv = createMockKV();
    const p = new Provisioner(kv);
    await p.provisionOrder({
      invoiceId: 40,
      orderId: 40,
      supplier: 'manual',
      supplierProductKey: '',
      clientEmail: 'x@y.z',
      orderConfig: {}
    });
    expect(await kv.get('provisioning:40:lock')).toBeNull();
  });

  it('BUG FIX #3: releases the lock via delete even when supplier fulfillment throws', async () => {
    const kv = createMockKV();
    const p = new Provisioner(kv);
    await expect(
      p.provisionOrder({
        invoiceId: 50,
        orderId: 50,
        supplier: 'resellportal',
        supplierProductKey: 'p1',
        clientEmail: 'x@y.z',
        orderConfig: {}
        // no resellPortalClient provided -> throws inside the try block
      })
    ).rejects.toThrow('resellPortalClient required');
    expect(await kv.get('provisioning:50:lock')).toBeNull();
  });

  it('idempotent double-call: calling provisionOrder twice in sequence provisions only once', async () => {
    const kv = createMockKV();
    const p = new Provisioner(kv);
    const supplierMock = {
      ensureClient: vi.fn().mockResolvedValue(undefined),
      createServiceOrder: vi.fn().mockResolvedValue({ service_id: 'svc-70' })
    };
    const params = {
      invoiceId: 70,
      orderId: 70,
      supplier: 'resellportal' as const,
      supplierProductKey: 'p1',
      clientEmail: 'x@y.z',
      orderConfig: {},
      resellPortalClient: supplierMock
    };
    const first = await p.provisionOrder(params);
    const second = await p.provisionOrder(params);
    expect(first.ok).toBe(true);
    expect(first.supplier_service_id).toBe('svc-70');
    expect(second.ok).toBe(true);
    expect(second.supplier_service_id).toBe('svc-70');
    // the supplier was only ever called once — the marker short-circuited
    expect(supplierMock.createServiceOrder).toHaveBeenCalledTimes(1);
  });
});
