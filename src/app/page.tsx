import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-600">
      {/* Ambient background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary-500 opacity-20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent-500 opacity-20 blur-3xl"
      />

      {/* Card */}
      <main className="relative z-10 glass rounded-3xl p-10 sm:p-14 max-w-lg w-full mx-4 flex flex-col items-center gap-8 text-center shadow-2xl">
        {/* Logo mark */}
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            className="w-9 h-9"
            aria-hidden="true"
          >
            <path
              d="M6 8h20M6 16h14M6 24h8"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Eunice Admissions
          </h1>
          <p className="text-primary-200 text-lg leading-relaxed">
            The smart way to manage school applications — for parents and staff alike.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link
            id="cta-parent-portal"
            href="/parent"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white text-primary-700 font-semibold py-3 px-6 text-base hover:bg-primary-50 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Parent Portal
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link
            id="cta-admin-login"
            href="/admin"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 text-white font-semibold py-3 px-6 text-base hover:bg-white/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            Admin Login
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Status strip */}
        <div className="flex items-center gap-2 text-primary-300 text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Platform is live · Phase 1 in progress
        </div>
      </main>
    </div>
  );
}
