import './globals.css';
import { Manrope, Source_Serif_4 } from 'next/font/google';
import type { Metadata } from 'next';
import { NavBar } from '@/components/nav';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans-ui',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Eunice Admissions Platform',
  description:
    'Digital school admissions for South African schools. Apply, track, and manage learner applications in one place.',
  keywords: ['school admissions', 'South Africa', 'Eunice High School', 'parent portal'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${sourceSerif.variable}`}>
      <head />
      <body className="font-sans min-h-screen flex flex-col bg-background text-foreground">
        <NavBar />
        <main className="flex-1 w-full">{children}</main>
      </body>
    </html>
  );
}
