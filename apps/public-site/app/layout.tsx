import type { Metadata } from 'next';
import './globals.css';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';

export const metadata: Metadata = {
  title: 'Glory Cloud Host',
  description: 'Faith-rooted hosting, built for those who serve.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
