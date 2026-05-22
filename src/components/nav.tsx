'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavBar() {
  const pathname = usePathname();
  const parentHref = '/parent';
  const adminHref = '/admin';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/85 backdrop-blur-xl shadow-[0_1px_0_rgba(15,23,42,0.03)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary-100 bg-gradient-to-br from-primary-700 to-primary-950 shadow-sm">
            <svg viewBox="0 0 32 32" fill="none" className="h-5 w-5 stroke-white" aria-hidden="true">
              <path d="M6 8h20M6 16h14M6 24h8" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <span className="block text-lg font-semibold tracking-tight text-slate-950">Eunice Admissions</span>
            <span className="block text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Intake platform</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={parentHref}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              pathname === parentHref ? 'bg-primary-50 text-primary-950' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            Parent Portal
          </Link>
          <Link
            href={adminHref}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              pathname === adminHref ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
