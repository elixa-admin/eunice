import Link from 'next/link';
import { PreviewShell } from '@/components/preview-shell';
import { SurfaceCard } from '@/components/surface-card';
import { SectionHeading } from '@/components/section-heading';
import { StatusBadge } from '@/components/status-badge';
import { previewApplications } from '@/lib/dev-preview-data';
import { isDocumentStateSubmissionReady } from '@eunice-shared/documents/contracts';

export default function DevParentPage() {
  const featuredApplication = previewApplications[0];

  return (
    <PreviewShell
      eyebrow="Dev Preview"
      title="Parent admissions dashboard"
      description="Calm, clear status tracking so parents can follow progress without chasing the school for updates."
      backLabel="Back to preview hub"
    >
      <div className="mb-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(22,163,74,0.09),rgba(202,138,4,0.10))] p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-primary-700/70">Welcome back</p>
              <h2 className="display-serif mt-3 text-4xl font-semibold text-slate-950">Lerato Khumalo</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Parents should never have to wonder what happens next. This dashboard is designed to make progress,
                missing items, and school updates easy to understand at a glance.
              </p>
            </div>

            <div className="rounded-3xl border border-accent-200 bg-white/85 p-4 shadow-[0_18px_45px_rgba(202,138,4,0.10)]">
              <div className="text-xs uppercase tracking-[0.18em] text-accent-700">Next expected action</div>
              <div className="mt-2 text-lg font-semibold text-slate-950">School review and document check</div>
              <div className="mt-2 text-sm leading-6 text-slate-600">
                The next update should appear once the admissions team completes this review step.
              </div>
              <div className="mt-4 rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-800">
                Latest update: {featuredApplication.updatedAt}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-primary-100 bg-white/80 px-4 py-3 text-sm text-slate-700">
              {previewApplications.length} active applications in this preview
            </div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-800">
              Current status: {featuredApplication.status.replace('_', ' ')}
            </div>
            <div className="rounded-2xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-700">
              {featuredApplication.documents.filter((item) => isDocumentStateSubmissionReady(item.status)).length} of {featuredApplication.documents.length} documents ready
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <SectionHeading
            title="Parent priorities"
            description="The UI should answer the first three questions a parent has without effort."
          />
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 px-4 py-3">What is my child’s current status?</div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 px-4 py-3">Are any documents still missing?</div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 px-4 py-3">When did the school last act on this application?</div>
          </div>
        </SurfaceCard>
      </div>

      <SectionHeading
        title="Applications"
        description="Each card should feel trustworthy, readable, and easy to revisit on mobile."
      />

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {previewApplications.slice(0, 3).map((app) => (
          <SurfaceCard key={app.id} className="overflow-hidden p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-slate-500">{app.ref}</div>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">{app.learnerName}</h3>
                <p className="text-sm text-slate-600">{app.grade}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <div className="mt-5 space-y-2 text-sm text-slate-600">
              <div>Submitted: {app.submittedAt}</div>
              <div>Last updated: {app.updatedAt}</div>
              <div>Parent contact: {app.parentEmail}</div>
              <div>{app.documents.filter((item) => isDocumentStateSubmissionReady(item.status)).length} of {app.documents.length} documents checked</div>
            </div>
            <div className="mt-5">
              <Link
                href={`/dev/application/${app.id}`}
                className="inline-flex rounded-xl bg-primary-900 px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_rgba(22,163,74,0.18)] transition hover:bg-primary-800"
              >
                View application
              </Link>
            </div>
          </SurfaceCard>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard className="p-6">
          <SectionHeading
            title="Recent school updates"
            description="A parent-facing activity stream keeps the tone calm and factual."
          />
          <div className="mt-5 space-y-3">
            {featuredApplication.timeline.map((entry) => (
              <div key={`${entry.at}-${entry.title}`} className="rounded-2xl border border-primary-100 bg-white/80 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-950">{entry.title}</div>
                  <div className="text-xs text-slate-500">{entry.at}</div>
                </div>
                <div className="mt-1 text-sm text-slate-600">{entry.detail}</div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <SectionHeading
            title="Needed next"
            description="This panel can become the parent’s single action area."
          />
          <div className="mt-5 rounded-2xl border border-accent-200 bg-accent-50 p-4 text-sm leading-6 text-accent-900">
            {featuredApplication.missingItems.length > 0
              ? `Still in progress: ${featuredApplication.missingItems.join(', ')}. Once that is cleared, the school can move this application forward without extra parent follow-up.`
              : 'Everything needed has been received. The school can continue processing this application.'}
          </div>
        </SurfaceCard>
      </div>
    </PreviewShell>
  );
}
