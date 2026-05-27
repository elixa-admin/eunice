import Image from 'next/image';
import Link from 'next/link';
import { previewApplications } from '@/lib/dev-preview-data';
import { PreviewShell } from '@/components/preview-shell';
import { SurfaceCard } from '@/components/surface-card';

const previewLinks = [
  {
    href: '/dev/admin',
    title: 'Admin Dashboard',
    description: 'Operations-focused admissions queue with status tracking and document review states.',
  },
  {
    href: '/dev/parent',
    title: 'Parent Portal',
    description: 'Application progress, recent updates, and the parent-facing admissions journey.',
  },
  {
    href: `/dev/application/${previewApplications[0].id}`,
    title: 'Application Detail',
    description: 'Deep dive view for a single learner record, notes, and document checklist.',
  },
];

const journeyCards = [
  {
    title: 'Families',
    body: 'A calmer portal for starting, saving, and tracking an application.',
    accent: 'border-emerald-200 bg-emerald-50/80',
  },
  {
    title: 'Admissions staff',
    body: 'A clearer review surface for checking documents, status, and next actions.',
    accent: 'border-amber-200 bg-amber-50/80',
  },
  {
    title: 'Shared rules',
    body: 'One system of truth for role-based access and application status.',
    accent: 'border-slate-200 bg-slate-50/80',
  },
];

export default function DevIndexPage() {
  return (
    <PreviewShell
      eyebrow="Eunice Platform Preview"
      title="A polished admissions front door"
      description="The preview now mirrors the direction of the final product: a public entry point that explains the two portals, then a set of route previews for families and staff."
      surface="hub"
      meta={(
        <div className="rounded-3xl border border-primary-100 bg-white px-5 py-4 text-sm text-slate-700 shadow-[0_16px_40px_rgba(31,109,58,0.10)]">
          <div className="text-xs uppercase tracking-[0.18em] text-primary-700/70">Preview sandbox</div>
          <div className="mt-1 font-medium text-slate-950">{previewApplications.length} sample applications loaded</div>
          <div className="mt-1">Safe to evolve independently from discovery tooling</div>
        </div>
      )}
    >
      <div className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1.36fr)_minmax(360px,0.64fr)]">
        <SurfaceCard className="overflow-hidden border border-primary-100 bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(255,248,231,0.96)_100%)] p-7 xl:min-h-[340px]">
          <div className="-mx-7 -mt-7 mb-6 h-1 bg-[#b88907]" />
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-[0_10px_24px_rgba(11,20,12,0.10)]">
                  <Image src="/eunice-school-logo.svg" alt="Eunice Girls School logo" width={32} height={32} className="h-8 w-8 object-contain" />
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-primary-700/75">Current focus</p>
              </div>
              <h2 className="display-serif mt-2 text-3xl font-semibold text-slate-950">One platform, two distinct experiences</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                The public-facing direction is now clearer: families should feel guided, staff should feel equipped, and the
                portal split should be obvious before anyone signs in.
              </p>
            </div>
            <div className="rounded-full border border-accent-100 bg-accent-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-accent-700">
              Active lane
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {journeyCards.map((card) => (
              <div key={card.title} className={`rounded-3xl border px-4 py-4 shadow-sm ${card.accent}`}>
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-700/75">{card.title}</div>
                <div className="mt-2 text-sm font-semibold text-slate-950">{card.body}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {[
              ['Discover', 'Website entry point', 'Homepage and admissions routes'],
              ['Apply', 'Form-led journey', 'Parents submit and save progress'],
              ['Review', 'Admissions workspace', 'Staff check documents and decisions'],
              ['Decide', 'Outcome and next step', 'Clear status updates for families'],
            ].map(([label, title, detail]) => (
              <div key={label} className="rounded-3xl border border-primary-100 bg-white/90 px-4 py-4 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-700/75">{label}</div>
                <div className="mt-2 text-sm font-semibold text-slate-950">{title}</div>
                <div className="mt-1 text-xs leading-5 text-slate-500">{detail}</div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(247,243,232,0.98)_100%)] p-7 xl:min-h-[340px]">
          <p className="text-xs uppercase tracking-[0.18em] text-primary-700/75">Portal split</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-primary-100 bg-primary-50/55 px-4 py-3">
              <div className="text-sm font-semibold text-slate-950">Parent Portal</div>
              <div className="mt-1 text-sm text-slate-600">Families see what to do next, what is still needed, and how to keep moving.</div>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50/55 px-4 py-3">
              <div className="text-sm font-semibold text-slate-950">Admin Dashboard</div>
              <div className="mt-1 text-sm text-slate-600">Admissions staff get the queue, triage, and decision context in one place.</div>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50/55 px-4 py-3">
              <div className="text-sm font-semibold text-slate-950">Public entry point</div>
              <div className="mt-1 text-sm text-slate-600">The home page should explain the product before it asks for a login.</div>
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {previewLinks.map((link) => (
          <Link key={link.href} href={link.href} className="block transition hover:-translate-y-1">
            <SurfaceCard className="h-full border border-primary-100 bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(255,248,231,0.96)_100%)] p-6 transition hover:border-primary-200 hover:shadow-[0_24px_60px_rgba(22,163,74,0.12)]">
              <div className="mb-3 text-xs uppercase tracking-[0.18em] text-primary-700/65">Preview route</div>
              <div className="mb-3 text-lg font-semibold text-slate-950">{link.title}</div>
              <p className="text-sm leading-6 text-slate-600">{link.description}</p>
              <div className="mt-5 text-sm font-medium text-primary-700">Open preview</div>
            </SurfaceCard>
          </Link>
        ))}
      </div>
    </PreviewShell>
  );
}
