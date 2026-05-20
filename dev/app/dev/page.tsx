import Link from 'next/link';
import { previewApplications } from '@/lib/dev-preview-data';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-200/80">
              Eunice Platform Preview
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">Separate dev surface for dashboard work</h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-300">
              This space is intentionally separate from the live assessment experience. It is meant for previewing
              the admissions platform we are building next.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
            <div>{previewApplications.length} sample applications loaded</div>
            <div>Zero dependency on the assessment form</div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {previewLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/8"
            >
              <div className="mb-3 text-lg font-semibold">{link.title}</div>
              <p className="text-sm leading-6 text-slate-300">{link.description}</p>
              <div className="mt-5 text-sm font-medium text-blue-200">Open preview</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
