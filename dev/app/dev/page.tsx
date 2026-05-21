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
      meta={(
        <div className="rounded-3xl border border-primary-100 bg-white px-5 py-4 text-sm text-slate-700 shadow-[0_16px_40px_rgba(14,165,233,0.10)]">
          <div>{previewApplications.length} sample applications loaded</div>
          <div>Safe to evolve independently from discovery tooling</div>
        </div>
      )}
    >
      <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard className="p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-primary-700/75">Current focus</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Design architecture and UI system</h2>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
              Active lane
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            We are shaping the future admissions experience around three product surfaces: a confident operations
            dashboard, a low-friction parent journey, and a detailed case-review screen that supports document checks
            and status decisions.
          </p>
        </SurfaceCard>

        <SurfaceCard className="p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-primary-700/75">Immediate outcomes</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 px-4 py-3">Shared preview components</div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 px-4 py-3">Consistent visual system</div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 px-4 py-3">Stronger parent and admin flows</div>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {previewLinks.map((link) => (
          <Link key={link.href} href={link.href} className="block transition hover:-translate-y-1">
            <SurfaceCard className="h-full p-6 transition hover:border-primary-200 hover:shadow-[0_24px_60px_rgba(14,165,233,0.12)]">
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
