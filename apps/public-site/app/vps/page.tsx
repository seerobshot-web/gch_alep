import { PageHero } from '../components/PageHero';
import { ProductGrid } from '../components/ProductGrid';
import { productsByCategory } from '../lib/catalog';

export default function VpsPage() {
  return (
    <>
      <PageHero
        eyebrow="VPS & Dedicated"
        title="Root-access servers for teams ready to scale."
        description="Dedicated CPU, memory, and storage on virtual and physical servers you fully control, backed by a support team that answers."
      />
      <ProductGrid products={productsByCategory('vps')} />
    </>
  );
}
