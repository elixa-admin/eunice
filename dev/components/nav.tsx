'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NavBar: React.FC = () => {
  const pathname = usePathname();

  // Highlight active links
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-primary-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/20 transition-all group-hover:bg-primary-500/20 group-hover:border-primary-500/30">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  className="w-5 h-5 stroke-white"
                  aria-hidden="true"
                >
                  <path
                    d="M6 8h20M6 16h14M6 24h8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="font-bold text-white text-lg tracking-tight transition-colors group-hover:text-primary-300">
                Eunice Admissions
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              id="nav-parent"
              href="/parent"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive('/parent')
                  ? 'bg-white text-primary-950 shadow-md'
                  : 'text-primary-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Parent Portal
            </Link>
            <Link
              id="nav-admin"
              href="/admin"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive('/admin')
                  ? 'bg-white/20 text-white border border-white/20'
                  : 'text-primary-200 hover:bg-white/5 hover:text-white'
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
