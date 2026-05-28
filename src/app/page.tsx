import Link from 'next/link';
import { SURFACE_CARD_CLASS_NAME } from '@/lib/ui-classes';
import { getDefaultTenantConfig } from '@/lib/domain/tenant-config';

const portalCards = [
  {
    href: '/parent',
    eyebrow: 'For families',
    title: 'Parent Portal',
    description:
      'Start an application, save progress, upload documents, and track what happens next from a calmer family-facing workspace.',
    primaryLabel: 'Go to Parent Portal',
    secondaryLabel: 'Create account',
    secondaryHref: '/auth/signup',
    accent: 'border-emerald-200 bg-emerald-50/80 text-emerald-950',
    highlight: 'Application journey, status, and next steps',
  },
  {
    href: '/admin',
    eyebrow: 'For admissions staff',
    title: 'Admin Dashboard',
    description:
      'Review submissions, read document health, and keep decisions moving with clearer operational context and triage cues.',
    primaryLabel: 'Open Admin Dashboard',
    secondaryLabel: 'Sign in',
    secondaryHref: '/auth/signin',
    accent: 'border-amber-200 bg-amber-50/80 text-amber-950',
    highlight: 'Queue review, document triage, and outcomes',
  },
];

const valueCards = [
  {
    title: 'One product, two paths',
    body: 'The public home page explains the difference between the parent journey and the staff workspace before asking anyone to sign in.',
  },
  {
    title: 'Guidance becomes action',
    body: 'The same cue-card thinking from the preview now turns into a cleaner set of next actions and routes.',
  },
  {
    title: 'Calmer by design',
    body: 'Typography, spacing, and color elevation work together so the interface feels finished rather than provisional.',
  },
];

const processSteps = [
  'Choose the portal that matches your role.',
  'Parents start or continue an application.',
  'Staff review and move applications forward.',
  'Status and next steps stay visible at every stage.',
];

export default function Home() {
  const tenant = getDefaultTenantConfig();
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[linear-gradient(180deg,#f5f0e3_0%,#efe7d3_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.13),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(202,138,4,0.10),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.08),_transparent_24%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className={`${SURFACE_CARD_CLASS_NAME} overflow-hidden rounded-[2.75rem] border border-emerald-100/80 bg-white/95 shadow-[0_30px_100px_rgba(15,23,42,0.09)] backdrop-blur-xl`}>
          <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-950">
                {tenant.shortName} Admissions Platform
              </div>

              <h1 className="display-serif mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl text-balance">
                A polished admissions front door for families and staff.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                This is the public entry point for {tenant.shortName} Admissions. It introduces the platform, explains the two portals,
                and helps each person get to the right experience without friction.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  id="cta-parent-portal"
                  href="/parent"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Enter Parent Portal
                </Link>
                <Link
                  id="cta-admin-login"
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  Open Admin Dashboard
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Sign in
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {['Public front door', 'Two portals', 'Role-aware access', 'Finished product feel'].map((tile) => (
                  <div key={tile} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium leading-6 text-slate-700 shadow-sm">
                    {tile}
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {valueCards.map((card) => (
                  <div key={card.title} className="rounded-[1.4rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
                    <div className="text-sm font-semibold text-slate-950">{card.title}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="border-t border-emerald-100/80 bg-[linear-gradient(180deg,rgba(5,46,38,0.98)_0%,rgba(7,58,46,0.98)_100%)] p-8 text-white sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Choose your path</p>
              <div className="mt-6 space-y-4">
                {portalCards.map((card) => (
                  <div key={card.title} className="rounded-[1.6rem] border border-white/10 bg-white/6 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
                    <div className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${card.accent}`}>
                      {card.eyebrow}
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold text-white">{card.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{card.description}</p>
                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                      {card.highlight}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={card.href}
                        className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-50"
                      >
                        {card.primaryLabel}
                      </Link>
                      <Link
                        href={card.secondaryHref}
                        className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        {card.secondaryLabel}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/6 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">How it works</div>
                <div className="mt-4 space-y-3">
                  {processSteps.map((step, index) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[11px] font-semibold text-white">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-6 text-slate-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/6 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Platform snapshot</div>
                <div className="mt-2 text-sm font-semibold text-white">Role-based access is already in place</div>
                <div className="mt-1 text-sm leading-6 text-slate-300">
                  The auth layer is shaped for both portals, with parents and staff routed into separate experiences.
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
