export function PageHero({
  eyebrow,
  title,
  description,
  children
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      {eyebrow && <p className="mb-3 font-body text-sm font-semibold uppercase tracking-wide text-verdigris-sky">{eyebrow}</p>}
      <h1 className="mb-4 font-display text-3xl font-bold text-hearth-ink">{title}</h1>
      <p className="text-lg text-hearth-ink/80">{description}</p>
      {children}
    </section>
  );
}
