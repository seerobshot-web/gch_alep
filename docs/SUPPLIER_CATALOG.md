# SUPPLIER_CATALOG — what GCH can resell (research snapshot, 2026-07)

Evidence basis: the sandbox proxy blocks direct fetches to both supplier
sites, so everything here is **search-index evidence** (indexed page
titles/snippets of the suppliers' own pages) unless marked otherwise.
Confirm against the live pages / authenticated APIs before hard-coding
anything into adapters or FOSSBilling products. The storefront-facing
subset lives in `apps/public-site/app/lib/catalog.ts`.

## ResellPortal (JSON REST — panel.resellportal.com/wp-json/resellportal/v1)

Platform: WordPress-based panel; API key + secret auth; ~100 req/min;
wallet-funded wholesale (no revenue share). Products are identified by
snake_case **`product_key`** strings in order/activation calls. Publicly
confirmed keys: `web_hosting`, `invoice_ai`. **Marketing slugs ≠ product
keys** (e.g. `/products/ai-invoicing/` ↔ `invoice_ai`) — the authoritative
key list requires the authenticated `GET /products` fixture.

Documented endpoint areas: clients · orders · provisioning · balance ·
products · domains · eSIM · SMM.

### Product lines (~30 products; "+19 AI tools")

| Line | Notes |
| --- | --- |
| Web Hosting | cPanel + WordPress Toolkit, unlimited bandwidth, auto backups, free SSL |
| Domains | all TLDs at wholesale, DNS mgmt, WHOIS privacy |
| VPN | 30+ countries, 10 devices, zero-log; wholesale ~$0.50–2.00/user/mo |
| eSIM Data | 4G/5G in 150+ countries, QR delivery |
| Business Phone | virtual numbers, IVR, AI voicemail transcription, 500 min/mo |
| Cloud Storage | encrypted, team workspaces, from ~$3/mo per client |
| CRM · AI Invoicing (`invoice_ai`) · E-Signature ("DocSign") · Website Builder · Email Marketing · Appointment Booking · Link in Bio (biolnk.net) · Social Media Automation · WordPress Plugin & Theme Pack (1500+) | SaaS apps, monthly per client |
| Web Design · SEO Services · SMM Growth | productized services |

### AI Business Tools suite (19 tools, wholesale ~$5–30/mo each)

Individually confirmed pages (slug under `/products/ai-business-tools/`):
Voice Agent (`voice-agent`) · SEO Rank Tracker (`seo-tracker`) · Market
Domination (`market-domination`) · AI CRM (`crm-assistant`) · Review
Responder (`review-responder`) · Contract Manager (`contract-manager`) ·
Website Health Monitor (`website-health-monitor`) · Email Responder
(`email-responder`) · Dynamic FAQ (`faq-assistant`).

Single-source (nav snippet only): Live Chat Bot · Lead Capture · Scheduler ·
Product Recommender · Business Intelligence · Website Spy · QR Campaigns ·
Lead Finder · Blog Generator · Chat Assistant.

## ResellersPanel (command API — cp.resellerspanel.com)

White-label free reseller program (in-house Hepsia cloud platform), plus a
separate paid cPanel/WHM reseller line. ICANN-accredited registrar.
Wholesale prices below are index-dated — treat as indicative.

| Line | Plans (published) |
| --- | --- |
| Cloud/shared hosting | Starter $2.75 · Business $3.50 · Corporate $7 · Enterprise $10 /mo + custom plans via "Plan Builder" |
| Semi-dedicated | Semi Dedicated 1 $15/mo (1 CPU core) · Semi Dedicated 2 $25/mo (2 cores, ded. IP) |
| VPS | KVM 4 / KVM 8 / KVM 16 / KVM 32 (NVMe); a few OpenVZ setups remain (names unverified) |
| Dedicated | ATOM 1 ~$50 · AMD 1 ~$100 · AMD 2 ~$120 /mo · Managed Services +$30/mo |
| Domains | 70–160+ TLDs, transfer + registration |
| WHOIS Privacy | $6/yr (.com .net .org .info .biz .co .me .tv .cc) |
| SSL certificates | Sectigo-based, stand-alone sellable; wildcard ≈$98/yr (dated) |
| Upgrades/add-ons | domain slots, CPU, MySQL quota, SSH, dedicated IPs, VPN traffic quota |
| cPanel reseller (paid line) | unlimited plans from $9/mo |

### Remote API — verified mechanics

Docs PDF: `https://cp.resellerspanel.com/downloads/ResellersPanelAPI.pdf`
(fetch it from an unproxied network — it is the authoritative source for
command strings).

- GET/POST; one or more commands per query (batching recommended);
  commands/params **case-sensitive**
- Output: **XML (default) or PHP serialization** via `return_type` —
  **no JSON/CSV evidence**
- Every result carries a `TTL` (min cache seconds); re-submitting the same
  command before TTL expiry is not allowed — honor it in the KV cache
- Test orders: append `TEST_MODE=1`; demo mode accepts any 15-digit card
- Access: 2 retained customers OR $100 deposit; **Demo Mode requires
  neither** (Reseller CP → Remote Access → Reseller API → API Settings)

**Verified command names (only these two):**

| Command | Purpose |
| --- | --- |
| `check_avail` | Domain availability + current TLD price |
| `get_datacenters` | Available data centers (pick DC when ordering) |

**Documented functional areas (section titles from the PDF's ToC — exact
command strings unverified, get them from the PDF):** check domain
availability · is username available · set domain DNSes · set domain
contacts · submit signup order · submit domain order · get offered plans /
semi-dedicated plans / VPS plans / dedicated servers · get domain prices
(promo + regular) · get upgrades' prices · get SSL certificate prices ·
get dedicated server upgrade prices · get countries list · get data
centers list · get TLD info.

⚠ The adapter's legacy wrappers (`listPlans`, `checkdomain`,
`createAccount`, `getAccountStatus`) came from the original scaffold and
are **NOT verified command strings** — they are marked
VERIFY-AGAINST-DOCS in code and must be corrected from the PDF before any
live call.
