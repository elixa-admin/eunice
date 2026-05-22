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
    <nav className="sticky top-0 z-50 w-full border-b border-primary-100/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 transition-all group-hover:bg-primary-100 group-hover:border-primary-200">
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
              <span className="display-serif text-lg font-bold tracking-tight text-slate-950 transition-colors group-hover:text-primary-700">
                Eunice Admissions
              </span>
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
                  ? 'bg-primary-900 text-white shadow-md'
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
                  ? 'border border-primary-200 bg-primary-50 text-primary-900'
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
