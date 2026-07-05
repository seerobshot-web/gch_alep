import { PageHero } from '../components/PageHero';
import { ProductGrid } from '../components/ProductGrid';
import { productsByCategory } from '../lib/catalog';

export default function VpnPage() {
  return (
    <>
      <PageHero
        eyebrow="VPN & Connectivity"
        title="Private access for a team that works from everywhere."
        description="Encrypted VPN and global eSIM data for staff, volunteers, and mission teams connecting from anywhere in the world."
      />
      <ProductGrid products={productsByCategory('vpn')} />
    </>
  );
}
