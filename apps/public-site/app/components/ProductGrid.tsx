import Link from 'next/link';
import type { CatalogProduct } from '../lib/catalog';

export function ProductGrid({ products }: { products: CatalogProduct[] }) {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <div key={p.slug} className="flex flex-col rounded-card border border-ash-stone bg-white/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-hearth-ink">{p.name}</h3>
            {p.status === 'coming-soon' && (
              <span className="rounded-pill bg-ember-gold px-3 py-0.5 text-xs font-semibold text-hearth-ink">
                Coming soon
              </span>
            )}
          </div>
          <p className="mb-4 flex-1 text-sm text-hearth-ink/80">{p.blurb}</p>
          {p.status === 'live' ? (
            <Link
              href={`/checkout?product=${p.slug}`}
              className="self-start rounded-pill bg-ember-core px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Get started
            </Link>
          ) : (
            <Link href="/contact" className="self-start text-sm font-semibold text-verdigris-sky hover:underline">
              Ask us about availability →
            </Link>
          )}
        </div>
      ))}
    </section>
  );
}
