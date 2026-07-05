import { PageHero } from '../components/PageHero';
import { ProductGrid } from '../components/ProductGrid';
import { productsByCategory } from '../lib/catalog';

export default function SaasPage() {
  return (
    <>
      <PageHero
        eyebrow="Business Software"
        title="Ready-made software, so you can focus on the mission."
        description="CRM, invoicing, e-signature, email marketing, booking, and more — subscribed in minutes, without another vendor relationship to manage."
      />
      <ProductGrid products={productsByCategory('saas')} />
    </>
  );
}
