'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavBar() {
  const pathname = usePathname();
  const parentHref = '/parent';
  const adminHref = '/admin';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-primary-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10">
            <svg viewBox="0 0 32 32" fill="none" className="h-5 w-5 stroke-white" aria-hidden="true">
              <path d="M6 8h20M6 16h14M6 24h8" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Eunice Admissions</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={parentHref}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              pathname === parentHref ? 'bg-white text-primary-950' : 'text-primary-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            Parent Portal
          </Link>
          <Link
            href={adminHref}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              pathname === adminHref ? 'bg-white/20 text-white' : 'text-primary-200 hover:bg-white/5 hover:text-white'
            }`}
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
