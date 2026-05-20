import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { NavBar } from '@/components/nav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
    <html lang="en" className={inter.variable}>
      <head />
      <body className="font-sans min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
        <NavBar />
        <main className="flex-1 w-full">{children}</main>
      </body>
    </html>
  );
}
