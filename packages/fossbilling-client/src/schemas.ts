import { z } from 'zod';

export const Supplier = z.enum(['resellportal', 'resellerspanel', 'manual']);

export const BillingCycle = z.enum(['monthly', 'quarterly', 'biannual', 'annual']);

export const Pricing = z.object({
  monthly: z.number().nonnegative().optional(),
  quarterly: z.number().nonnegative().optional(),
  biannual: z.number().nonnegative().optional(),
  annual: z.number().nonnegative().optional()
});

export const ProductConfig = z.object({
  supplier: Supplier,
  supplier_product_key: z.string(),
  upsell_ids: z.array(z.number().int()).default([]),
  required_fields: z.array(z.string()).default([]),
  manual_fulfillment: z.boolean().default(false)
});

export const Product = z.object({
  id: z.number().int(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable().default(null),
  type: z.string(),
  pricing: Pricing,
  config: ProductConfig
});
export type Product = z.infer<typeof Product>;

export const Client = z.object({
  id: z.number().int(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  company: z.string().nullable().default(null),
  phone: z.string().nullable().default(null),
  created_at: z.string()
});
export type Client = z.infer<typeof Client>;

export const OrderStatus = z.enum(['pending_setup', 'active', 'suspended', 'canceled', 'failed_setup']);

export const Order = z.object({
  id: z.number().int(),
  client_id: z.number().int(),
  product_id: z.number().int(),
  title: z.string(),
  status: OrderStatus,
  period: BillingCycle,
  price: z.number(),
  supplier_service_id: z.string().nullable().default(null),
  order_config: z.record(z.string(), z.unknown()).default({}),
  created_at: z.string(),
  expires_at: z.string().nullable().default(null)
});
export type Order = z.infer<typeof Order>;

export const Invoice = z.object({
  id: z.number().int(),
  client_id: z.number().int(),
  status: z.enum(['unpaid', 'paid', 'refunded', 'canceled']),
  total: z.number(),
  currency: z.string().length(3),
  hash: z.string(),
  created_at: z.string(),
  paid_at: z.string().nullable().default(null)
});
export type Invoice = z.infer<typeof Invoice>;

export const InlineRegisterInput = z.object({
  email: z.string().email(),
  password: z.string().min(10, 'Use at least 10 characters'),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  company: z.string().optional()
});
export type InlineRegisterInput = z.infer<typeof InlineRegisterInput>;

/**
 * BUG FIX (#5): login is email+password only. The scaffold previously
 * validated the login route with InlineRegisterInput, which requires
 * first_name/last_name — every real login attempt would 400 before it
 * ever reached FOSSBilling.
 */
export const LoginInput = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
export type LoginInput = z.infer<typeof LoginInput>;

export const CreateOrderInput = z.object({
  product_id: z.number().int(),
  period: BillingCycle,
  config: z.record(z.string(), z.string()).default({}),
  upsell_product_ids: z.array(z.number().int()).max(2).default([])
});
export type CreateOrderInput = z.infer<typeof CreateOrderInput>;
