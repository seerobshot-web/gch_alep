/**
 * TODO-FIXTURE: Replace the minimal stubs below with sanitized ResellPortal
 * JSON fixtures (see CLAUDE.md fixture checklist). Do NOT invent fields
 * that are not present in the real sanitized responses.
 */
import { z } from 'zod';

export const ResellPortalProductStub = z.object({
  id: z.string(),
  title: z.string().optional(),
  slug: z.string().optional()
});
export type ResellPortalProductStub = z.infer<typeof ResellPortalProductStub>;

export const ResellPortalBalanceStub = z.object({
  success: z.boolean().optional(),
  balance: z.number().optional(),
  currency: z.string().optional()
});
export type ResellPortalBalanceStub = z.infer<typeof ResellPortalBalanceStub>;
