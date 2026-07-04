export default function OpsInvoicesPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="mb-3 font-body text-sm font-semibold uppercase tracking-wide text-verdigris-sky">Invoices</p>
      <h1 className="mb-4 font-display text-3xl font-bold text-hearth-ink">Invoice polling status.</h1>
      <p className="text-lg text-hearth-ink/80">
        Recently paid invoices seen by the poller, their provisioning outcomes, and any that need manual attention.
      </p>
    </section>
  );
}
