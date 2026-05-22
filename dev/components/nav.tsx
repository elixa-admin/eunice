'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NavBar: React.FC = () => {
  const pathname = usePathname();
  const isDevSurface = pathname.startsWith('/dev');

  // Highlight active links
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary-100/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,248,241,0.95))] backdrop-blur-md shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="h-1 w-full bg-[linear-gradient(90deg,rgba(31,109,58,0.95),rgba(184,137,7,0.95))]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(240,253,244,0.92))] transition-all group-hover:border-primary-200 group-hover:shadow-[0_10px_24px_rgba(22,163,74,0.10)]">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  className="h-5 w-5 stroke-primary-800"
                  aria-hidden="true"
                >
                  <path
                    d="M6 8h20M6 16h14M6 24h8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="leading-tight">
                <span className="display-serif block text-[1.42rem] font-bold tracking-tight text-slate-950 transition-colors group-hover:text-primary-700">
                  Eunice Admissions
                </span>
                <span className="type-label text-slate-500">Admissions platform preview</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              id="nav-parent"
              href={isDevSurface ? '/dev/parent' : '/parent'}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive('/parent')
                  || isActive('/dev/parent')
                  ? 'bg-primary-900 text-white shadow-[0_12px_24px_rgba(22,163,74,0.18)]'
                  : 'text-slate-700 hover:bg-primary-50 hover:text-primary-800'
              }`}
            >
              Parent Portal
            </Link>
            <Link
              id="nav-admin"
              href={isDevSurface ? '/dev/admin' : '/admin'}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive('/admin')
                  || isActive('/dev/admin')
                  ? 'border border-accent-200 bg-accent-50 text-accent-900 shadow-[0_10px_24px_rgba(202,138,4,0.12)]'
                  : 'text-slate-600 hover:bg-primary-50 hover:text-primary-800'
              }`}
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
