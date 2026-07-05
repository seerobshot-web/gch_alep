import { PageHero } from '../components/PageHero';
import { ProductGrid } from '../components/ProductGrid';
import { productsByCategory } from '../lib/catalog';

export default function HostingPage() {
  return (
    <>
      <PageHero
        eyebrow="Web Hosting"
        title="Shared cPanel hosting that just works."
        description="Fast, reliable web hosting for churches, ministries, and small businesses — provisioned automatically the moment your invoice clears."
      />
      <ProductGrid products={productsByCategory('hosting')} />
    </>
  );
}
