import type { Metadata } from 'next';
import './globals.css';
import { PortalNav } from './components/PortalNav';

export const metadata: Metadata = {
  title: 'My Account — Glory Cloud Host',
  description: 'Manage your Glory Cloud Host services, invoices, and support tickets.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PortalNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
