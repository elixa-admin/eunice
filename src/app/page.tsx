import Link from 'next/link';

const featureTiles = [
  'A guided parent application journey',
  'A calmer admin review workspace',
  'Clear document status and recovery',
  'Preview builds aligned to Vercel',
];

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.11),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(202,138,4,0.10),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.08),_transparent_24%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="surface-card rounded-[2.25rem] border border-emerald-100/80 bg-white/94 p-8 shadow-[0_25px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-950">
              Eunice Admissions Platform
            </div>

            <h1 className="display-serif mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl text-balance">
              A calmer way for families and staff to manage admissions.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Built for parents and admissions teams who need a clearer intake experience, stronger document handling, and a more trustworthy review flow.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                id="cta-parent-portal"
                href="/parent"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Parent Portal
              </Link>
              <Link
                id="cta-admin-login"
                href="/admin"
                className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {featureTiles.map((tile) => (
                <div key={tile} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium leading-6 text-slate-700 shadow-sm">
                  {tile}
                </div>
              ))}
            </div>
          </section>

          <aside className="surface-card space-y-4 rounded-[2rem] border border-slate-200/80 bg-slate-950 p-8 text-white shadow-[0_25px_90px_rgba(15,23,42,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Platform snapshot</p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white">Current phase</div>
              <div className="mt-1 text-sm leading-6 text-slate-300">Sprint E: admin intelligence and guided parent flow</div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold text-white">What is live</div>
                <div className="mt-1 text-sm leading-6 text-slate-300">
                  Parent workflow, admin triage, upload handling, and role-aware navigation.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold text-white">What we are improving</div>
                <div className="mt-1 text-sm leading-6 text-slate-300">
                  Better guidance, calmer hierarchy, stronger recovery messaging, and clearer next steps.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
