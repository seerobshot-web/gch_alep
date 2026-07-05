import { PageHero } from '../components/PageHero';
import { ProductGrid } from '../components/ProductGrid';
import { productsByCategory } from '../lib/catalog';

export default function AiToolsPage() {
  return (
    <>
      <PageHero
        eyebrow="AI Tools"
        title="Nineteen AI tools, curated and provisioned for you."
        description="From an AI receptionist to review responses and rank tracking — a vetted suite your team can subscribe to in minutes, billed alongside everything you already host with us."
      />
      <ProductGrid products={productsByCategory('ai-tools')} />
    </>
  );
}
