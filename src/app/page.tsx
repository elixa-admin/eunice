import Link from 'next/link';

const featureTiles = [
  'Parent-friendly application flow',
  'Admin review and document triage',
  'Live preview aligned to Vercel',
];

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(88,28,135,0.11),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.08),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(253,186,116,0.08),_transparent_24%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-purple-100/80 bg-white/94 p-8 shadow-[0_25px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-950">
              Eunice Admissions Platform
            </div>

            <h1 className="display-serif mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              A calmer, more guided way to handle school admissions.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Built for parents, reviewers, and admissions teams who need a clearer intake experience, smarter document handling, and a more trustworthy workflow.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                id="cta-parent-portal"
                href="/parent"
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Parent Portal
              </Link>
              <Link
                id="cta-admin-login"
                href="/admin"
                className="inline-flex items-center justify-center rounded-xl border border-purple-200 bg-white px-5 py-3 text-sm font-semibold text-purple-950 transition hover:border-purple-300 hover:bg-purple-50"
              >
                Admin Dashboard
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {featureTiles.map((tile) => (
                <div key={tile} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700 shadow-sm">
                  {tile}
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-4 rounded-[2rem] border border-slate-200/80 bg-slate-950 p-8 text-white shadow-[0_25px_90px_rgba(15,23,42,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Platform snapshot</p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white">Current phase</div>
              <div className="mt-1 text-sm leading-6 text-slate-300">Phase B: product feel and trust layer</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white">What’s live</div>
              <div className="mt-1 text-sm leading-6 text-slate-300">
                Intake role model, document orchestration, parent workflow, admin triage, and Vercel preview alignment.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white">Next upgrade</div>
              <div className="mt-1 text-sm leading-6 text-slate-300">
                Stronger visual hierarchy, better guidance, and a more polished admissions experience.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
