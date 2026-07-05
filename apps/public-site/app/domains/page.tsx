import { PageHero } from '../components/PageHero';
import { ProductGrid } from '../components/ProductGrid';
import { productsByCategory } from '../lib/catalog';

export default function DomainsPage() {
  return (
    <>
      <PageHero
        eyebrow="Domains & SSL"
        title="Claim the address your community will remember."
        description="Search, register, and secure domains alongside your hosting — one invoice, one login, one place to renew."
      />
      <ProductGrid products={productsByCategory('domains')} />
    </>
  );
}
