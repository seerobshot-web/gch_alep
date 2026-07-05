import Link from 'next/link';
import { HeroMedia } from './components/HeroMedia';

export default function HomePage() {
  return (
    <>
      <HeroMedia
        videoSrc="/images/video/worship-hands-16x9-pexels19087723.mp4"
        posterSrc="/images/hero/home-hero-poster.jpg"
      >
        <p className="mb-3 font-body text-sm font-semibold uppercase tracking-wide text-white/90">Glory Cloud Host</p>
        <h1 className="mb-4 max-w-2xl font-display text-4xl font-bold">
          Hosting built by believers, for anyone building something that matters.
        </h1>
        <p className="max-w-xl text-lg text-white/85">
          From your first website to a full VPS fleet, we pair dependable infrastructure with a team that treats your
          calling as seriously as you do.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/pricing" className="rounded-pill bg-white px-6 py-3 font-semibold text-ember-core hover:opacity-90">
            See Plans
          </Link>
          <Link href="/migration" className="rounded-pill border border-white/60 px-6 py-3 font-semibold text-white hover:bg-white/10">
            Migrate for Free
          </Link>
        </div>
      </HeroMedia>
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
