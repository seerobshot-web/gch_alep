# GCH_AlephRep — Glory Cloud Host monorepo

pnpm + Turborepo monorepo for [gloryhosts.cloud](https://gloryhosts.cloud). Stock FOSSBilling
(external, on Hostinger) is the billing brain; this repo is the TypeScript layer only.

## Quickstart

1. Copy `.env.example` → `.env` and fill secrets (use test/demo keys)
2. `pnpm install`
3. `pnpm dev`

Other commands: `pnpm test` (Vitest) · `pnpm build` · `pnpm lint`

## Workspace layout

| Path | What it is |
| --- | --- |
| `apps/public-site` | Storefront (gloryhosts.cloud) |
| `apps/client-portal` | Customer portal (my.gloryhosts.cloud) |
| `apps/admin-core` | Ops app: cron poller + FOSSBilling hook (ops.gloryhosts.cloud) |
| `packages/config` | Typed env loader (sole `process.env` reader), rate limiter, Tailwind design tokens |
| `packages/provisioning` | Idempotent provisioning orchestration + KV stores (Upstash prod / SQLite dev) |
| `packages/fossbilling-client` | Server-only FOSSBilling API client + zod schemas |
| `packages/resellportal-adapter` | Server-only ResellPortal JSON client (fixture-gated) |
| `packages/resellerspanel-adapter` | Server-only ResellersPanel XML client (fixture-gated) |
| `infra/fossbilling` | Pinned docker-compose for local FOSSBilling module dev only |
| `fixtures/` | Sanitized supplier/FOSSBilling API responses (see fixtures/README.md) |

## DNS mapping

| Host | Target |
| --- | --- |
| `gloryhosts.cloud` | Vercel — apps/public-site |
| `my.gloryhosts.cloud` | Vercel — apps/client-portal |
| `ops.gloryhosts.cloud` | Vercel — apps/admin-core (Vercel protection ON; unauth = 404) |
| `billing.gloryhosts.cloud` | External FOSSBilling on Hostinger |

Cookies are scoped per-subdomain, httpOnly, Secure, SameSite=Lax.

## Vercel cron setup (invoice polling)

`apps/admin-core/vercel.json` schedules `POST /api/cron/poll-invoices` every
15 minutes. The route requires:

```
Authorization: Bearer <CRON_SECRET>
```

Configure `CRON_SECRET` in the admin-core Vercel project's environment, and
set the same value in the Vercel Cron job's headers. The route compares the
token with `timingSafeEqual` and returns 401 otherwise.

**Production KV is required**: set `KV_URL` and `KV_TOKEN` (Upstash REST) in
Vercel env. Without them the poller falls back to SQLite, which does NOT
survive between serverless invocations — idempotency markers would be lost
and orders could double-provision. The fallback logs a loud warning.

## Ground rules (enforced)

- `process.env` is read **only** in `packages/config/src/env.ts` — enforced by
  an ESLint `no-restricted-syntax` rule in CI, not convention.
- Adapters and fossbilling-client are server-only (`server-only` import guard).
- Every inbound API body/query is zod-validated; secrets compared with `timingSafeEqual`.
- **No service-deletion action anywhere in the UI.** Cancellation = suspend-request
  ticket + 7-day grace period.
- Adapter response schemas stay TODO-fixture stubs until sanitized fixtures land
  in `fixtures/` — never invent supplier API fields.
