import 'server-only';
import { z } from 'zod';

/**
 * Env loader: the ONLY place in the workspace that reads process.env
 * directly (CLAUDE.md rule 1). Every other module must import the typed
 * `env` object from here. The `server-only` import throws if this module
 * is ever pulled into a client bundle.
 */

const EnvSchema = z.object({
  FOSSBILLING_URL: z.string().url(),
  FOSSBILLING_API_KEY: z.string(),

  RESELLPORTAL_URL: z.string().url(),
  RESELLPORTAL_KEY: z.string(),
  RESELLPORTAL_SECRET: z.string(),

  RESELLERSPANEL_URL: z.string().url(),
  RESELLERSPANEL_KEY: z.string(),
  RESELLERSPANEL_SECRET: z.string(),
  RESELLERSPANEL_DEMO_MODE: z.string().optional().default('true'),

  HOOK_SHARED_SECRET: z.string(),
  CRON_SECRET: z.string(),

  KV_URL: z.string().optional().default(''),
  KV_TOKEN: z.string().optional().default(''),
  SQLITE_PATH: z.string().optional().default('./dev-data/kv.sqlite'),

  NEXT_PUBLIC_SITE_URL: z.string().url()
});

type EnvShape = z.infer<typeof EnvSchema>;

let cached: EnvShape | null = null;

// Lazy parse: `next build` imports route modules to collect page data in an
// environment without real secrets. Validation runs on first property
// access at request time instead of at import time.
export const env: EnvShape = new Proxy({} as EnvShape, {
  get(_target, prop) {
    if (!cached) cached = EnvSchema.parse(process.env);
    return cached[prop as keyof EnvShape];
  }
});
export type Env = EnvShape;
