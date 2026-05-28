import './globals.css';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { NavBar } from '@/components/nav';
import { getDefaultTenantConfig } from '@/lib/domain/tenant-config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const tenant = getDefaultTenantConfig();

export const metadata: Metadata = {
  title: `${tenant.shortName} Admissions Platform`,
  description:
    'Digital school admissions for South African schools. Apply, track, and manage learner applications in one place.',
  keywords: ['school admissions', 'South Africa', tenant.name, 'parent portal'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <head />
      <body className="font-sans min-h-screen flex flex-col bg-background text-foreground">
        <NavBar />
        <main className="flex-1 w-full">{children}</main>
      </body>
    </html>
  );
}
