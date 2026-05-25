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
    <nav className="sticky top-0 z-50 w-full border-b border-[#0f3c28]/15 bg-[linear-gradient(180deg,rgba(9,48,31,0.98),rgba(13,64,40,0.96))] text-white shadow-[0_12px_32px_rgba(11,20,12,0.22)] backdrop-blur-md">
      <div className="h-[3px] w-full bg-[linear-gradient(90deg,rgba(239,202,84,0.95),rgba(174,127,6,0.95))]" />
      <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="flex h-[68px] items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/95 transition-all group-hover:border-white/35 group-hover:shadow-[0_10px_24px_rgba(11,20,12,0.12)]">
                <img
                  src="/eunice-school-logo.svg"
                  alt="Eunice Girls School logo"
                  className="h-7 w-7 object-contain"
                />
              </div>
              <div className="leading-tight">
                <span className="display-serif block text-[1.28rem] font-semibold tracking-tight text-white transition-colors group-hover:text-white/95">
                  Eunice Admissions
                </span>
                <span className="type-label text-white/70">Admissions platform preview</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              id="nav-parent"
              href={isDevSurface ? '/dev/parent' : '/parent'}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive('/parent')
                  || isActive('/dev/parent')
                  ? 'border border-[#ead284] bg-[#fff8e7] text-[#081c12] shadow-[0_10px_24px_rgba(202,138,4,0.12)]'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              Parent Portal
            </Link>
            <Link
              id="nav-admin"
              href={isDevSurface ? '/dev/admin' : '/admin'}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive('/admin')
                  || isActive('/dev/admin')
                  ? 'border border-[#ead284] bg-[#fff8e7] text-[#081c12] shadow-[0_10px_24px_rgba(202,138,4,0.12)]'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
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
