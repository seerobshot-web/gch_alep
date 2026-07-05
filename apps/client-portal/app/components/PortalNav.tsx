import Link from 'next/link';

const LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/services', label: 'Services' },
  { href: '/domains', label: 'Domains' },
  { href: '/invoices', label: 'Invoices' },
  { href: '/billing', label: 'Billing' },
  { href: '/support', label: 'Support' },
  { href: '/account', label: 'Account' }
];

export function PortalNav() {
  return (
    <header className="border-b border-ash-stone bg-cloudlight">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-bold text-hearth-ink">
          Glory Cloud Host <span className="text-verdigris-sky">· My Account</span>
        </Link>
        <nav className="hidden flex-wrap gap-6 md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-hearth-ink hover:text-verdigris-sky">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
