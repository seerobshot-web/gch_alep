/**
 * GCH marketing catalog — the storefront's view of what we sell.
 *
 * IMPORTANT: this is marketing copy + navigation data ONLY, curated from
 * the suppliers' public catalogs (research notes: docs/SUPPLIER_CATALOG.md).
 * It is NOT supplier API data:
 *  - `supplierKey` stays null until the real key arrives via fixtures
 *    (ResellPortal product_keys like "web_hosting" come from the
 *    authenticated GET /products; ResellersPanel plan ids come from
 *    demo-mode listPlans). Never guess keys — CLAUDE.md rule 5.
 *  - Live sale of a product is driven by FOSSBilling (product.config),
 *    not by this file; `status: 'live'` here only unlocks the checkout
 *    link in the UI.
 */

export type CatalogCategory =
  | 'hosting'
  | 'vps'
  | 'domains'
  | 'ai-tools'
  | 'vpn'
  | 'saas'
  | 'services';

export interface CatalogProduct {
  name: string;
  slug: string;
  category: CatalogCategory;
  supplier: 'resellportal' | 'resellerspanel' | 'manual';
  blurb: string;
  status: 'live' | 'coming-soon';
  /** Supplier product key/plan id — fixture-gated, never guessed. */
  supplierKey: string | null;
}

export const CATALOG: CatalogProduct[] = [
  // ── ResellersPanel: cPanel hosting / servers / domains ──────────────
  {
    name: 'Shared Web Hosting',
    slug: 'shared-hosting',
    category: 'hosting',
    supplier: 'resellerspanel',
    blurb: 'cPanel hosting for church sites, blogs, and small business storefronts — SSL, backups, and one-click installs included.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'Semi-Dedicated Hosting',
    slug: 'semi-dedicated-hosting',
    category: 'hosting',
    supplier: 'resellerspanel',
    blurb: 'Fewer accounts per server and more headroom — for congregations whose site has outgrown entry-level shared plans.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'VPS Servers',
    slug: 'vps',
    category: 'vps',
    supplier: 'resellerspanel',
    blurb: 'Root-access virtual private servers with dedicated resources, for teams running their own stack.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'Dedicated Servers',
    slug: 'dedicated-servers',
    category: 'vps',
    supplier: 'resellerspanel',
    blurb: 'Entire physical machines for the heaviest workloads — media archives, livestream origins, multi-site ministries.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'Domain Registration',
    slug: 'domains',
    category: 'domains',
    supplier: 'resellerspanel',
    blurb: 'Register and renew the address your community remembers, with DNS management and WHOIS privacy.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'SSL Certificates',
    slug: 'ssl-certificates',
    category: 'domains',
    supplier: 'resellerspanel',
    blurb: 'Padlock every page — standard and wildcard certificates for your domains and subdomains.',
    status: 'coming-soon',
    supplierKey: null
  },

  // ── ResellPortal: infrastructure & connectivity ─────────────────────
  {
    name: 'Managed WordPress Hosting',
    slug: 'wordpress-hosting',
    category: 'hosting',
    supplier: 'resellportal',
    blurb: 'cPanel hosting with the WordPress Toolkit, automatic backups, unlimited bandwidth, and free SSL.',
    status: 'coming-soon',
    supplierKey: null // ResellPortal product_key "web_hosting" pending GET /products fixture
  },
  {
    name: 'Secure VPN',
    slug: 'vpn',
    category: 'vpn',
    supplier: 'resellportal',
    blurb: 'Encrypted connections across 30+ countries, ten devices per user, zero-log policy — for staff working from anywhere.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'eSIM Data Plans',
    slug: 'esim-data',
    category: 'vpn',
    supplier: 'resellportal',
    blurb: '4G/5G data in 150+ countries delivered as a QR code — connectivity for mission trips and traveling teams.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'Business Phone',
    slug: 'business-phone',
    category: 'saas',
    supplier: 'resellportal',
    blurb: 'A virtual number for your ministry with auto-attendant, business-hours routing, and AI voicemail transcription.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'Cloud Storage',
    slug: 'cloud-storage',
    category: 'saas',
    supplier: 'resellportal',
    blurb: 'Encrypted team file storage with share links and role-based access — sermon archives included.',
    status: 'coming-soon',
    supplierKey: null
  },

  // ── ResellPortal: SaaS business software ────────────────────────────
  {
    name: 'CRM',
    slug: 'crm',
    category: 'saas',
    supplier: 'resellportal',
    blurb: 'Track members, donors, and follow-ups in one place with pipelines and reminders.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Invoicing',
    slug: 'ai-invoicing',
    category: 'saas',
    supplier: 'resellportal',
    blurb: 'Send invoices, take card payments, and let automated reminders chase the follow-up for you.',
    status: 'coming-soon',
    supplierKey: null // product_key "invoice_ai" pending fixture confirmation
  },
  {
    name: 'E-Signature',
    slug: 'e-signature',
    category: 'saas',
    supplier: 'resellportal',
    blurb: 'Legally binding signatures for volunteer agreements, facility contracts, and board documents.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'Website Builder',
    slug: 'website-builder',
    category: 'saas',
    supplier: 'resellportal',
    blurb: 'Drag-and-drop site builder with AI content help — a first web presence in an afternoon.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'Email Marketing',
    slug: 'email-marketing',
    category: 'saas',
    supplier: 'resellportal',
    blurb: 'Newsletters, automations, and signup forms for keeping your congregation in the loop.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'Appointment Booking',
    slug: 'appointment-booking',
    category: 'saas',
    supplier: 'resellportal',
    blurb: 'Let members book counseling sessions, dedications, and meetings with automatic reminders.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'Link in Bio',
    slug: 'link-in-bio',
    category: 'saas',
    supplier: 'resellportal',
    blurb: 'One link for every platform — sermons, giving, events — with click analytics.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'Social Media Automation',
    slug: 'social-media-automation',
    category: 'saas',
    supplier: 'resellportal',
    blurb: 'Schedule a month of posts in one sitting across every platform your community uses.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'WordPress Plugin & Theme Pack',
    slug: 'wordpress-plugin-pack',
    category: 'saas',
    supplier: 'resellportal',
    blurb: '1,500+ premium plugins and themes — SEO, security, design, performance — under one subscription.',
    status: 'coming-soon',
    supplierKey: null
  },

  // ── ResellPortal: the 19-tool AI Business Tools suite ───────────────
  {
    name: 'AI Voice Agent',
    slug: 'ai-voice-agent',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'An AI receptionist that answers around the clock, books appointments, and takes messages.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Live Chat Bot',
    slug: 'ai-live-chat',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'A website chat assistant trained on your content, greeting visitors when your team is away.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Dynamic FAQ',
    slug: 'ai-dynamic-faq',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'A self-learning knowledge-base widget that answers the questions your visitors actually ask.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Lead Capture',
    slug: 'ai-lead-capture',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'Turn visits into introductions — smart forms that qualify and route new contacts.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Scheduler',
    slug: 'ai-scheduler',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'Conversational scheduling that finds the slot, books it, and sends the reminder.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Product Recommender',
    slug: 'ai-product-recommender',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'Personalized suggestions for stores and resource libraries.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Business Intelligence',
    slug: 'ai-business-intelligence',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'Plain-language answers from your business data — no dashboards degree required.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Email Responder',
    slug: 'ai-email-responder',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'Monitors your inbox and drafts on-tone replies for routine questions.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI CRM Assistant',
    slug: 'ai-crm-assistant',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'Contacts, deals, and pipeline with AI insights and a built-in chat assistant.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Review Responder',
    slug: 'ai-review-responder',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'Keeps your Google reviews answered promptly, in your voice.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Website Spy',
    slug: 'ai-website-spy',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'Watches competitor sites and reports what changed.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Contract Manager',
    slug: 'ai-contract-manager',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'Uploads auto-categorized; key dates and values extracted; renewals tracked.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI QR Campaigns',
    slug: 'ai-qr-campaigns',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'Trackable QR codes for bulletins, banners, and events.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI SEO Rank Tracker',
    slug: 'ai-seo-tracker',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'Keyword rankings and competitor movement with AI recommendations.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Market Domination',
    slug: 'ai-market-domination',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'Local competitor analysis that turns findings into a strategy.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Lead Finder',
    slug: 'ai-lead-finder',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'Surfaces local organizations and contacts that fit your outreach.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Blog Generator',
    slug: 'ai-blog-generator',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'Drafts posts in your voice from a topic and an outline.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Website Health Monitor',
    slug: 'ai-website-health',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'Uptime, Core Web Vitals, security scans, and broken-link audits — explained in plain language.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'AI Chat Assistant',
    slug: 'ai-chat-assistant',
    category: 'ai-tools',
    supplier: 'resellportal',
    blurb: 'A general-purpose assistant for drafting, summarizing, and answering, under your brand.',
    status: 'coming-soon',
    supplierKey: null
  },

  // ── Services (manual fulfillment) ───────────────────────────────────
  {
    name: 'Web Design',
    slug: 'web-design',
    category: 'services',
    supplier: 'manual',
    blurb: 'A designed-for-you website: layout, content, payments, and launch handled by our team.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'SEO Services',
    slug: 'seo-services',
    category: 'services',
    supplier: 'manual',
    blurb: 'Technical audits, content improvements, and local visibility work, reported monthly.',
    status: 'coming-soon',
    supplierKey: null
  },
  {
    name: 'Site Migration',
    slug: 'site-migration',
    category: 'services',
    supplier: 'manual',
    blurb: 'We move your existing site to GCH end-to-end, free — zero downtime is the goal.',
    status: 'live',
    supplierKey: null
  }
];

export function productsByCategory(category: CatalogCategory): CatalogProduct[] {
  return CATALOG.filter((p) => p.category === category);
}

export function productBySlug(slug: string): CatalogProduct | undefined {
  return CATALOG.find((p) => p.slug === slug);
}
