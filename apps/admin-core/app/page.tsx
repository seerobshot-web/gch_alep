export default function OpsOverviewPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="mb-3 font-body text-sm font-semibold uppercase tracking-wide text-verdigris-sky">Ops Overview</p>
      <h1 className="mb-4 font-display text-3xl font-bold text-hearth-ink">Operations dashboard.</h1>
      <p className="text-lg text-hearth-ink/80">
        Live status of cron polling, provisioning locks, and supplier connectivity for the Glory Cloud Host platform.
      </p>
    </section>
  );
}
