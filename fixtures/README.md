# fixtures/ — sanitized supplier & FOSSBilling API responses

Adapter response schemas stay TODO-fixture stubs until real sanitized
fixtures land here (CLAUDE.md rule 5: never invent supplier API fields).

Expected files (see the fixture checklist in CLAUDE.md):

| Path | Source | How to obtain |
| --- | --- | --- |
| `resellportal/products.json` | ResellPortal `GET /products` | Real output exists from prior testing — sanitize keys/ids and paste |
| `resellportal/order-web-hosting-test.json` | ResellPortal `POST /orders` with `test_mode:true` for `web_hosting` | Run against the panel with test mode |
| `resellerspanel/list-plans.xml` | ResellersPanel `listPlans` demo mode | Enable Demo Mode: Reseller Control Panel → Remote Access |
| `resellerspanel/create-account.xml` | ResellersPanel `createAccount` demo mode | Same demo-mode session |
| `fossbilling/order-create.json` | FOSSBilling `admin/order/create` result | Requires FOSSBilling installed on Hostinger first |
| `fossbilling/invoice-get.json` | FOSSBilling `admin/invoice/get` result | Same install |

Sanitize before committing: strip API keys, real emails, real customer
names/domains, and wallet balances.
