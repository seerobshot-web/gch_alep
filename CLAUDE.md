# CLAUDE.md — GCH_AlephRep (Glory Cloud Host platform)

## What this project is
Monorepo (pnpm + Turborepo) for gloryhosts.cloud — a faith-rooted hosting
storefront. Stock FOSSBilling (PHP, external, on Hostinger) is the billing
brain; this repo is the TypeScript layer only. Two upstream suppliers fulfill
orders: ResellPortal (JSON REST — AI tools/VPN/SaaS) and ResellersPanel
(XML command API — cPanel hosting/VPS/domains). Never vendor or fork
FOSSBilling into this repo.

## Domain topology
gloryhosts.cloud → apps/public-site · my.gloryhosts.cloud → apps/client-portal
· ops.gloryhosts.cloud → apps/admin-core (Vercel protection + 404-to-unauth)
· billing.gloryhosts.cloud → external FOSSBilling.
Cookies scoped per-subdomain, httpOnly, Secure, SameSite=Lax.

## Non-negotiable rules
1. process.env is read ONLY in packages/config/src/env.ts. Everything else
   imports the typed `env` object. Supplier keys never leave adapter packages.
2. Adapters and fossbilling-client are server-only ("server-only" import
   guard). Nothing secret in NEXT_PUBLIC_* or client bundles.
3. zod-validate every inbound API body/query. timingSafeEqual for all secret
   comparisons.
4. NO service-deletion action anywhere in UI. ResellPortal's DELETE
   /services/{id} is irreversible after ~5s. Cancellation = suspend-request
   ticket; deleteService in the adapter requires a confirmDestroy token AND
   the FOSSBilling module enforces a 7-day suspended grace period first.
5. Never invent supplier API response fields. Schemas marked TODO-fixture
   stay stubs until real sanitized fixtures land in fixtures/.
6. Provisioning must stay idempotent: marker key provisioned:{invoiceId}:{orderId},
   lock key provisioning:{orderId}:lock (setNX, 60s TTL), marker written
   before lock release, ensureClient = lookup-by-email before create.
7. Design tokens (Tailwind preset in packages/config): cloudlight #F6F2E7 bg,
   ember-core #A83E1B primary, ember-gold #E0A537 background/chip ONLY never
   text color, hearth-ink #2C231C text, ash-stone #C9C0AF decorative borders
   only, verdigris-sky #3E6E64 links/info, border-interactive #8F8672 for
   inputs. Radius: card 12px, pill 999px. Syne display / Plus Jakarta Sans
   body. No dark backgrounds; high-emphasis = solid ember-core + white text.

## Current state
Copilot generated the initial scaffold (root config, packages/config,
packages/provisioning + sqlite KV + tests, both adapter skeletons, admin-core
cron/hook routes, per-app middleware, a few portal/public routes). An earlier
scaffold produced packages/fossbilling-client (schemas.ts, client.ts) and
public-site routes /api/products, /api/checkout/account, /api/checkout/order —
integrate these, don't rewrite.

## KNOWN BUGS in the Copilot scaffold — fix these FIRST (priority order)
1. Middleware files are at apps/*/app/middleware.ts — Next.js requires
   middleware.ts at the app ROOT (next to app/), not inside app/. Move all
   three; verify host-matching logic runs.
2. SqliteKV.setNX uses INSERT OR IGNORE, which returns false if an EXPIRED
   row still exists — an expired lock permanently blocks provisioning for
   that order. Fix: delete expired rows for the key before the insert (or
   check expires_at in the same statement).
3. Provisioner lock release (finally block) does kv.set(lockKey,'released',2)
   — it should DELETE the lock. Add a delete(key) method to the KVStore
   interface and both impls; releasing by overwrite with TTL is fragile.
4. Cron route instantiates SqliteKV on every request — on Vercel the
   filesystem is ephemeral and per-invocation, so idempotency markers
   VANISH between cron runs in production. Implement the Upstash/Vercel KV
   impl and select impl from env (KV_URL present → KV, else sqlite for
   local dev only). This is the most dangerous bug: silent double-provisioning.
5. client-portal login route validates with InlineRegisterInput (requires
   first_name/last_name) — logins will always 400. Create a LoginInput
   schema (email + password only). Also remove the express-rate-limit
   import — it's Express middleware, incompatible with Next route handlers;
   use the shared sliding-window util instead.
6. Deep cross-package imports ('@gch/config/src/env',
   '@gch/provisioning/src/kv') bypass package boundaries and break once
   builds emit to dist/. Add proper exports maps to each package.json and
   import from package roots.
Also: pin FOSSBilling docker image to a specific version tag (never :latest),
and node-fetch is unnecessary on Node 18+ — use global fetch.

## Fixture checklist (blocks adapter completion)
- [ ] ResellPortal: GET /products JSON (real output exists from prior testing)
- [ ] ResellPortal: POST /orders test_mode:true response for web_hosting
- [ ] ResellersPanel: demo-mode XML for plan listing + createAccount
      (requires Demo Mode ON in Reseller Control Panel → Remote Access)
- [ ] FOSSBilling: admin/order/create result + admin/invoice/get result
      (requires FOSSBilling installed on Hostinger first)
API-access note: ResellersPanel live API requires 2 retained customers OR
$100 wallet deposit; demo mode requires neither — build against demo.

## Commands
pnpm install · pnpm dev · pnpm test (Vitest) · pnpm build · pnpm lint

## Definition of done for the current phase
All 6 known bugs fixed with tests proving: lock acquire/release/expiry,
idempotent double-call, KV impl selection, login schema. Remaining app pages
scaffolded as placeholders with correct layouts/tokens. README updated with
Vercel cron setup (Authorization: Bearer CRON_SECRET) and DNS mapping table.
