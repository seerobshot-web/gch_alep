/**
 * TODO-FIXTURE: Replace these stubs with sanitized demo-mode XML->JS
 * fixture shapes (see CLAUDE.md fixture checklist). Do NOT invent fields.
 */
import { z } from 'zod';

export const RP_PlanStub = z.object({
  planid: z.string(),
  name: z.string().optional(),
  price: z.string().optional()
});
export type RP_PlanStub = z.infer<typeof RP_PlanStub>;
