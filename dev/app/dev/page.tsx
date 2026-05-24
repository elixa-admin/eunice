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

export default function DevIndexPage() {
  return (
    <PreviewShell
      eyebrow="Eunice Platform Preview"
      title="Admissions product preview"
      description="A focused product sandbox for the Eunice platform. This is where we shape the parent and staff experience while keeping it separate from the assessment workflow."
      surface="hub"
      meta={(
        <div className="rounded-3xl border border-primary-100 bg-white px-5 py-4 text-sm text-slate-700 shadow-[0_16px_40px_rgba(31,109,58,0.10)]">
          <div className="text-xs uppercase tracking-[0.18em] text-primary-700/70">Preview sandbox</div>
          <div className="mt-1 font-medium text-slate-950">{previewApplications.length} sample applications loaded</div>
          <div className="mt-1">Safe to evolve independently from discovery tooling</div>
        </div>
      )}
    >
      <div className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1.42fr)_minmax(360px,0.58fr)]">
        <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(31,109,58,0.10),rgba(184,137,7,0.09))] p-7 xl:min-h-[320px]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-[0_10px_24px_rgba(11,20,12,0.10)]">
                  <img src="/eunice-school-logo.svg" alt="Eunice Girls School logo" className="h-8 w-8 object-contain" />
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-primary-700/75">Current focus</p>
              </div>
              <h2 className="display-serif mt-2 text-3xl font-semibold text-slate-950">A polished admissions website, not a wireframe</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                The goal is to make the preview feel like a finished school admissions product: structured, trustworthy,
                and elegant enough to feel real at first glance.
              </p>
            </div>
            <div className="rounded-full border border-accent-100 bg-accent-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-accent-700">
              Active lane
            </div>
          </div>
          <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-primary-100 bg-white/88 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Public flow</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">Academic and calm</div>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-white/88 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Admin flow</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">Operational and richer</div>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-white/88 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Brand mode</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">Green and gold aligned</div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="overflow-hidden p-7 xl:min-h-[320px]">
          <p className="text-xs uppercase tracking-[0.18em] text-primary-700/75">Site cues</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-2xl border border-primary-100 bg-primary-50/55 px-4 py-3">
              <div className="text-sm font-semibold text-slate-950">School website rhythm</div>
              <div className="mt-1 text-sm text-slate-600">The landing frame should feel designed, not assembled.</div>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50/55 px-4 py-3">
              <div className="text-sm font-semibold text-slate-950">Admissions clarity</div>
              <div className="mt-1 text-sm text-slate-600">Each surface should answer the next obvious question.</div>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50/55 px-4 py-3">
              <div className="text-sm font-semibold text-slate-950">Consistent brand feel</div>
              <div className="mt-1 text-sm text-slate-600">Green, gold, and restrained academic polish everywhere.</div>
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {previewLinks.map((link) => (
          <Link key={link.href} href={link.href} className="block transition hover:-translate-y-1">
            <SurfaceCard className="h-full p-6 transition hover:border-primary-200 hover:shadow-[0_24px_60px_rgba(22,163,74,0.12)]">
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
