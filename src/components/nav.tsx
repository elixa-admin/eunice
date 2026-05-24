'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function NavBar() {
  const pathname = usePathname();
  const parentHref = '/parent';
  const adminHref = '/admin';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-emerald-900/20 bg-[#005c42]/96 text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/eunice-school-logo.svg" alt="Eunice crest" width={46} height={46} className="h-11 w-11 object-contain drop-shadow-sm" />
            <div>
              <span className="block text-lg font-semibold tracking-tight text-white">Eunice Admissions</span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.24em] text-[#e7c86b]">Intake platform</span>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Link
              href={parentHref}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                pathname === parentHref ? 'bg-[#d6aa3a] text-[#0a3d2d] shadow-[0_0_0_1px_rgba(214,170,58,0.4)]' : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              Parent Portal
            </Link>
            <Link
              href={adminHref}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                pathname === adminHref ? 'bg-[#d6aa3a] text-[#0a3d2d] shadow-[0_0_0_1px_rgba(214,170,58,0.4)]' : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
