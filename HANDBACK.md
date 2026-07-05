# HANDBACK — GCH_AlephRep scaffold + bug-fix pass

Date: 2026-07-04 · Branch: `claude/gch-aleph-rep-setup-n9xunh`

## Starting point

The repository contained **only CLAUDE.md** — none of the Copilot scaffold
files described in it were actually committed. So this pass scaffolded the
full monorepo from the CLAUDE.md spec and the file listing embedded in the
kickoff prompt, writing every known bug's FIX directly (each verified
against the buggy code shown in the kickoff listing) rather than
committing broken code first.

Verified state: `pnpm install`, `pnpm build` (8/8), `pnpm test` (39 tests,
13/13 tasks), `pnpm lint` (8/8) all green.

## Bugs fixed, with the tests that prove each

| # | Bug | Fix | Proving test(s) |
| --- | --- | --- | --- |
| 1 | Middleware at `apps/*/app/middleware.ts` never ran | Moved to app-root `middleware.ts` in all three apps, with a comment explaining Next's placement requirement; `localhost` allowed for dev | `public-site/test/middleware.test.ts`, `client-portal/test/middleware.test.ts`, `admin-core/test/middleware.test.ts` — host-matching 404 + security headers |
| 2 | `SqliteKV.setNX` deadlocked on expired rows | Expired rows for the key are deleted before the `INSERT OR IGNORE` | `sqlite-kv.test.ts` → "regression (bug #2): setNX succeeds when an EXPIRED lock row is still present" (+ live-lock and expiry tests) |
| 3 | Lock released by overwrite-with-TTL | `KVStore.delete(key)` added to the interface and both impls; `Provisioner` releases via `delete` in `finally` | `provision.test.ts` → "releases the lock via delete after a successful run" AND "…even when supplier fulfillment throws" |
| 4 | Cron instantiated `SqliteKV` per request (markers vanish on Vercel) | `kv-factory.ts`: `KV_URL`+`KV_TOKEN` → real `UpstashKV` (`@upstash/redis`), else SqliteKV with a loud dev-only `console.warn`; cron route uses the factory | `kv-factory.test.ts` → both branches, including the warning assertion |
| 5 | Login validated with `InlineRegisterInput`; express-rate-limit import | `LoginInput` (email+password) added to fossbilling-client schemas; login route uses it + the shared sliding-window limiter from `@gch/config/rate-limit` | `schemas.test.ts` → "does not require first_name/last_name…" (asserts the old schema still rejects the login shape); `rate-limit.test.ts` (5 tests) |
| 6 | Deep imports (`@gch/config/src/env`) break against `dist/` | Proper `exports` maps in every package.json; all imports are package-root or exported-subpath (`@gch/config/env`, `@gch/provisioning/kv-factory`, …); required switching packages to `moduleResolution: node16` | `pnpm build` green across all 8 workspaces is the proof; client.test.ts title references it |

Also done: FOSSBilling docker image pinned to `fossbilling/fossbilling:0.6.16`
(verify this tag against the release you actually test); node-fetch removed
everywhere in favor of Node 18+ global fetch (asserted in
`fossbilling-client/test/client.test.ts`); provisioning idempotent
double-call test added ("…provisions only once", asserts the supplier is
called exactly once across two invocations).

## Integration (cron route)

`apps/admin-core/app/api/cron/poll-invoices/route.ts` no longer hardcodes
`'resellportal'` / `'TODO'` / a fake email. Per order it now calls
`getOrder(oid)` → `getProduct(order.product_id)` → `getClient(order.client_id)`
and routes on `product.config.supplier` / `supplier_product_key` /
`client.email`, passing real adapter instances. `getRecentInvoices` was
implemented against `admin/invoice/get_list` with an in-memory paid-since
filter — the exact list-method name and its filter params are marked
**VERIFY-AGAINST-INSTALL** in the code (as are `order/get`, `client/get`,
the invoice→order_ids linkage, and `updateOrderSupplierServiceId`).

## Audit findings (rule violations in the scaffold-as-specified, fixed)

- **Rule 1**: `SqliteKV`'s constructor default read `process.env.SQLITE_PATH`
  — removed (path is now a required constructor arg; the factory passes
  `env.SQLITE_PATH`). Rule is now CI-enforced via ESLint
  `no-restricted-syntax` (root `.eslintrc.cjs`; test dirs exempt).
- **Rule 2**: adapters and fossbilling-client had no `server-only` guard —
  added to both adapters, fossbilling-client, and `config/env.ts`
  (replacing the weaker `typeof window` check).
- **Rule 3**: the admin hook route logged the full unvalidated body and the
  cron/order routes were fine, but the hook body is now zod-validated too.
- `checkout/order` imported a nonexistent `@/lib/session` — implemented as
  an HMAC-signed (timingSafeEqual-verified) httpOnly cookie util.
- public-site `checkout/account` had no matching client-portal issue but
  used `InlineRegisterInput` correctly (registration — left as-is per bug
  #5's scope; only login used the wrong schema).
- admin middleware CSP no longer embeds `RESELLPORTAL_URL`; ops app is
  `default-src 'self'`.

## Deliberate deviations / notes

- `env` is parsed **lazily** (Proxy, first property access) — `next build`
  imports route modules without real secrets; eager parse broke every app
  build. Still the sole `process.env` reader.
- `@gch/provisioning`'s root export does NOT re-export `kv-factory`
  (it would drag env validation into plain unit-test consumers); import it
  from `@gch/provisioning/kv-factory`.
- Vitest configs alias `server-only` to a stub and `@gch/*` to source —
  test-only, documented in each `vitest.config.ts`.
- `/api/products` is `force-dynamic` (it proxies live billing data and
  otherwise gets statically prerendered at build).
- Pages scaffolded: public-site 16, client-portal 9 (cancel page carries
  the suspend-first/7-day copy and ONLY a "Request cancellation" ticket
  action), admin-core 3. Rate limiting is in-memory per instance — swap in
  the KV backend (the limiter already accepts one) before multi-region.

## Supplier catalog integration (added 2026-07-05)

- `docs/SUPPLIER_CATALOG.md` — evidence-labeled research snapshot of both
  suppliers' full catalogs (ResellPortal: ~30 products incl. the 19-tool
  AI suite; ResellersPanel: cloud/semi-dedicated/VPS/dedicated/domains/
  WHOIS/SSL lines with published plan tiers).
- `apps/public-site/app/lib/catalog.ts` — 36-product marketing catalog
  (supplier keys all null/fixture-gated); rendered by `ProductGrid` on
  the six category pages; served by `/api/catalog`.
- ResellersPanel adapter: verified commands `check_avail` +
  `get_datacenters` added; test switch corrected to `TEST_MODE=1`; all
  legacy/area wrappers explicitly marked VERIFY-AGAINST-DOCS (the exact
  command strings must come from cp.resellerspanel.com's API PDF).
- ResellPortal adapter: catalog-wide surface added (domains/eSIM/SMM/
  status) as TODO-fixture stubs; `product_key` vocabulary confirmed only
  for `web_hosting` and `invoice_ai`.
- New route: `GET /api/domains/check?domain=` (zod + rate limit +
  verified check_avail; response untyped until demo XML fixture).
- Visual assets: `docs/IMAGE_SOURCING_GUIDE.md` (10-placement shortlist,
  duotone recipe, dork strings) + five supplied Pexels clips compressed
  into `public/images/video/`; home hero plays the worship-hands loop.

## Open questions

1. FOSSBilling: exact method names/filters flagged VERIFY-AGAINST-INSTALL
   (invoice list "paid since" filter, invoice→order_ids shape, client/get,
   order/get, supplier-service-id persistence path).
2. Migration endpoint uses `MIGRATION_PRODUCT_ID = 0` — needs the real
   manual-fulfillment product id from the live FOSSBilling instance.
3. `fossbilling/fossbilling:0.6.16` — confirm this is the tag you tested.
4. Should checkout/account normalize "email exists" to 409 (comment says
   so, currently 500)? Needs the real FOSSBilling error code — fixture-gated.

## Fixture files still needed (exact expected paths)

- `fixtures/resellportal/products.json` — GET /products (sanitized; real output exists)
- `fixtures/resellportal/order-web-hosting-test.json` — POST /orders `test_mode:true`, web_hosting
- `fixtures/resellerspanel/list-plans.xml` — demo-mode listPlans
- `fixtures/resellerspanel/create-account.xml` — demo-mode createAccount
- `fixtures/fossbilling/order-create.json` — admin/order/create result
- `fixtures/fossbilling/invoice-get.json` — admin/invoice/get result

These gate: adapter response schemas (currently TODO-fixture stubs that
throw), `getRecentInvoices` hardening, and the invoice→orders mapping in
the cron route.
