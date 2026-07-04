import Link from 'next/link';

// Top-level nav mirrors the approved wireframes (Features · Pricing ·
// Migration · Support · Blog); product-line pages hang off /features and
// the footer.
const LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/migration', label: 'Migration' },
  { href: '/support', label: 'Support' },
  { href: '/blog', label: 'Blog' }
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
        <div className="flex items-center gap-4">
          <a
            href="https://my.gloryhosts.cloud/login"
            className="text-sm text-hearth-ink hover:text-verdigris-sky"
          >
            Sign in
          </a>
          <Link
            href="/checkout"
            className="rounded-pill bg-ember-core px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
