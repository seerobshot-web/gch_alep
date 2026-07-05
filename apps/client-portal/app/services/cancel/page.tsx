import { PageHero } from '../../components/PageHero';

/**
 * CLAUDE.md rule 4: there is NO service-deletion action anywhere in the UI.
 * Cancellation opens a suspend-request ticket; the service is suspended
 * first and held through a 7-day grace period before anything further
 * happens. This page must only ever offer the "Request cancellation"
 * ticket action.
 */
export default function CancelServicePage() {
  return (
    <PageHero
      eyebrow="Cancel a Service"
      title="Request a cancellation."
      description="We never delete a service on the spot. When you request cancellation, the service is suspended first and held for a 7-day grace period — so a change of heart, a missed backup, or a billing mix-up never costs you your data."
    >
      <div className="mt-8 rounded-card border border-ash-stone bg-white/40 p-6 text-left">
        <h2 className="mb-2 font-display text-lg font-semibold text-hearth-ink">How cancellation works</h2>
        <ol className="mb-6 list-decimal space-y-2 pl-5 text-sm text-hearth-ink/80">
          <li>You submit a cancellation request below — it opens a support ticket on your account.</li>
          <li>Your service is suspended (taken offline) but nothing is deleted.</li>
          <li>A 7-day grace period begins. During it you can reinstate the service with one reply to the ticket.</li>
          <li>After the grace period, our team completes the cancellation.</li>
        </ol>
        <button
          type="button"
          className="rounded-pill bg-ember-core px-6 py-3 font-semibold text-white hover:opacity-90"
        >
          Request cancellation
        </button>
        <p className="mt-3 text-xs text-hearth-ink/60">
          This opens a ticket — it does not delete anything. You can withdraw the request any time during the grace period.
        </p>
      </div>
    </PageHero>
  );
}
