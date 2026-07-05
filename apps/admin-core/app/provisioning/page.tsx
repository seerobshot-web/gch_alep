export default function ProvisioningPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="mb-3 font-body text-sm font-semibold uppercase tracking-wide text-verdigris-sky">Provisioning</p>
      <h1 className="mb-4 font-display text-3xl font-bold text-hearth-ink">Provisioning runs and locks.</h1>
      <p className="text-lg text-hearth-ink/80">
        Recent provisionOrder outcomes, in-flight locks, and idempotency markers — the audit trail for every order we fulfill.
      </p>
    </section>
  );
}
