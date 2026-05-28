import './globals.css';
import { IBM_Plex_Sans, IBM_Plex_Sans_Condensed } from 'next/font/google';
import type { Metadata } from 'next';
import { NavBar } from '@/components/nav';
import { getDefaultTenantConfig } from '@eunice-shared/domain/tenant-config';

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-sans-ui',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const plexSansCondensed = IBM_Plex_Sans_Condensed({
  subsets: ['latin'],
  variable: '--font-sans-condensed',
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
  const fontUiFallback = process.env.NEXT_PUBLIC_THEME_FONT_UI_FALLBACK ?? 'IBM Plex Sans';

  return (
    <html lang="en" className={`${plexSans.variable} ${plexSansCondensed.variable}`}>
      <head />
      <body
        className="font-sans min-h-screen flex flex-col bg-background text-foreground"
        style={{ '--font-ui-fallback': fontUiFallback } as Record<string, string>}
      >
        <NavBar />
        <main className="flex-1 w-full">{children}</main>
      </body>
    </html>
  );
}
