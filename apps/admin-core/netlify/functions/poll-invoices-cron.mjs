/**
 * Netlify Scheduled Function — the Netlify equivalent of the Vercel cron
 * in vercel.json. Fires every 15 minutes and calls the app's own
 * poll-invoices route with the same Bearer CRON_SECRET contract, so the
 * route stays platform-agnostic.
 *
 * This is platform glue running OUTSIDE the Next.js app (Netlify's own
 * functions runtime), so it reads the two env vars it needs directly —
 * a documented, lint-scoped exception to CLAUDE.md rule 1 (mirroring
 * env.ts itself). URL is injected by Netlify with the site's live URL.
 */
export default async () => {
  const base = process.env.URL;
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) {
    console.error('[poll-invoices-cron] URL or CRON_SECRET missing — skipping run');
    return;
  }
  const res = await fetch(`${base}/api/cron/poll-invoices`, {
    method: 'POST',
    headers: { authorization: `Bearer ${secret}` }
  });
  console.log(`[poll-invoices-cron] ${res.status}`);
};

export const config = {
  schedule: '*/15 * * * *'
};
