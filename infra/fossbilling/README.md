# FOSSBilling deployment — Docker (VPS or local)

Hostinger *shared hosting* installs of FOSSBilling are error-prone (PHP
extension set, rewrite rules, cron restrictions). The supported path here
is Docker: identical stack locally and in production, pinned versions, no
shared-hosting quirks. CLAUDE.md only requires FOSSBilling to be
**external to this repo** — any Docker host works.

## Option A — production on a small VPS (recommended)

Any ~$5–6/mo VPS with Docker (Hostinger VPS, Hetzner CX11, DigitalOcean
1 GB, etc.):

```bash
# on the VPS
git clone <this repo> && cd gch_alep/infra/fossbilling
cp .env.example .env            # set real passwords + BILLING_DOMAIN
nano .env                       #   BILLING_DOMAIN=billing.gloryhosts.cloud
docker compose up -d
```

Before `up`: point the `billing.gloryhosts.cloud` A record (Hostinger DNS
zone) at the VPS IP. Caddy then auto-provisions Let's Encrypt TLS on
first request — no certificate work.

Then complete the FOSSBilling web installer at
`https://billing.gloryhosts.cloud`, and afterwards:

1. Admin → **Settings → API** → copy the admin API key →
   `FOSSBILLING_API_KEY` on all three Netlify/Vercel sites.
2. Create products (config carries `supplier`, `supplier_product_key` —
   the shape `@gch/fossbilling-client`'s `ProductConfig` expects) and the
   manual-fulfillment migration product (then set the real id in
   `apps/public-site/app/api/migration/request/route.ts`).
3. Set up the FOSSBilling cron per its installer instructions (the
   container runs it internally; verify in admin → System).
4. Capture sanitized `admin/order/create` and `admin/invoice/get`
   responses into `fixtures/fossbilling/` (paths in `fixtures/README.md`).

## Option B — local fixture capture only

```bash
cd infra/fossbilling
cp .env.example .env            # defaults are fine (BILLING_DOMAIN=localhost)
docker compose up -d
open http://localhost           # run the web installer
```

Same post-install steps 1–4 against `http://localhost`; point your local
`.env`'s `FOSSBILLING_URL=http://localhost` to develop the billing path
end-to-end before any production host exists.

## Upgrades & backups

- Image tag is pinned (`fossbilling/fossbilling:0.6.16`). To upgrade:
  snapshot volumes, bump the tag, `docker compose up -d`, verify.
- Back up the `db-data` and `fossbilling-data` volumes (e.g.
  `docker run --rm -v fossbilling_db-data:/v -v $PWD:/b alpine tar czf /b/db-backup.tgz /v`).
