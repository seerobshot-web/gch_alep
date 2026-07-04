import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-ash-stone bg-cloudlight">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-hearth-ink md:flex-row md:justify-between">
        <p>&copy; {new Date().getFullYear()} Glory Cloud Host. Hosted with purpose.</p>
        <div className="flex gap-6">
          <Link href="/faith" className="hover:text-verdigris-sky">
            Our Faith
          </Link>
          <Link href="/support" className="hover:text-verdigris-sky">
            Support
          </Link>
          <Link href="/contact" className="hover:text-verdigris-sky">
            Contact
          </Link>
          <Link href="/legal/terms" className="hover:text-verdigris-sky">
            Terms
          </Link>
          <Link href="/legal/privacy" className="hover:text-verdigris-sky">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
