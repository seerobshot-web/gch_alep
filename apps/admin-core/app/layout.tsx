import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ops — Glory Cloud Host',
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-ash-stone bg-cloudlight">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <span className="font-display text-xl font-bold text-hearth-ink">GCH Ops</span>
            <nav className="flex gap-6">
              <Link href="/" className="text-sm text-hearth-ink hover:text-verdigris-sky">
                Overview
              </Link>
              <Link href="/provisioning" className="text-sm text-hearth-ink hover:text-verdigris-sky">
                Provisioning
              </Link>
              <Link href="/invoices" className="text-sm text-hearth-ink hover:text-verdigris-sky">
                Invoices
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
