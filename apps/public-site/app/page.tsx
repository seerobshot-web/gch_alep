import Link from 'next/link';
import { PageHero } from './components/PageHero';

export default function HomePage() {
  return (
    <>
      <PageHero
        eyebrow="Glory Cloud Host"
        title="Hosting built by believers, for anyone building something that matters."
        description="From your first website to a full VPS fleet, we pair dependable infrastructure with a team that treats your calling as seriously as you do."
      >
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/pricing" className="rounded-pill bg-ember-core px-6 py-3 font-semibold text-white hover:opacity-90">
            See Plans
          </Link>
          <Link href="/migration" className="rounded-pill border border-border-interactive px-6 py-3 font-semibold text-hearth-ink hover:bg-ash-stone/20">
            Migrate for Free
          </Link>
        </div>
      </PageHero>
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: '/hosting', title: 'Web Hosting', copy: 'Shared cPanel hosting for churches, ministries, and small businesses.' },
          { href: '/vps', title: 'VPS', copy: 'Root-access virtual servers for teams that have outgrown shared hosting.' },
          { href: '/domains', title: 'Domains', copy: 'Register and manage the address your community will remember.' },
          { href: '/ai-tools', title: 'AI Tools', copy: 'Curated AI utilities to help your team move faster, responsibly.' },
          { href: '/vpn', title: 'VPN', copy: 'Private, encrypted access for staff working across time zones and borders.' },
          { href: '/saas', title: 'SaaS', copy: 'Ready-to-use software so you can focus on ministry, not maintenance.' }
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-card border border-ash-stone bg-white/40 p-6 transition hover:border-verdigris-sky"
          >
            <h2 className="mb-2 font-display text-xl font-semibold text-hearth-ink">{card.title}</h2>
            <p className="text-sm text-hearth-ink/80">{card.copy}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
