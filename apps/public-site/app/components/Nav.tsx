import Link from 'next/link';

const LINKS = [
  { href: '/hosting', label: 'Web Hosting' },
  { href: '/vps', label: 'VPS' },
  { href: '/domains', label: 'Domains' },
  { href: '/ai-tools', label: 'AI Tools' },
  { href: '/vpn', label: 'VPN' },
  { href: '/saas', label: 'SaaS' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/migration', label: 'Free Migration' },
  { href: '/about', label: 'About' }
];

export function Nav() {
  return (
    <header className="border-b border-ash-stone bg-cloudlight">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-bold text-hearth-ink">
          Glory Cloud Host
        </Link>
        <nav className="hidden flex-wrap gap-6 md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-hearth-ink hover:text-verdigris-sky">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/checkout"
          className="rounded-pill bg-ember-core px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
