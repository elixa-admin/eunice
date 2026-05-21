import { notFound } from 'next/navigation';
import { PreviewShell } from '@/components/preview-shell';
import { SectionHeading } from '@/components/section-heading';
import { StatusBadge } from '@/components/status-badge';
import { SurfaceCard } from '@/components/surface-card';
import { previewApplications, previewDocumentClasses } from '@/lib/dev-preview-data';

export default async function DevApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = previewApplications.find((item) => item.id === id);

  if (!application) {
    notFound();
  }

  return (
    <PreviewShell
      eyebrow="Application Preview"
      title={application.learnerName}
      description={`${application.parentName} · ${application.ref}`}
      backHref="/dev/admin"
      backLabel="Back to admin"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <SurfaceCard className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400">Current status</div>
              <div className="mt-2">
                <StatusBadge status={application.status} />
              </div>
            </div>
            <div className="text-sm text-slate-400">Grade: {application.grade}</div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Parent</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{application.parentName}</div>
              <div className="mt-1 text-sm text-slate-600">{application.parentEmail}</div>
              <div className="text-sm text-slate-600">{application.parentPhone}</div>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Previous school</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{application.previousSchool}</div>
              <div className="mt-1 text-sm text-slate-600">{application.schoolYear}</div>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Assigned reviewer</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{application.assignedTo}</div>
              <div className="mt-1 text-sm text-slate-600">{application.completion}% complete</div>
            </div>
          </div>

          <SectionHeading
            title="Document checklist"
            description="This view should support fast verification decisions without overwhelming staff."
          />
          <div className="space-y-3">
            {application.documents.map((document) => (
              <div
                key={document.label}
                className="mt-3 flex items-center justify-between rounded-2xl border border-primary-100 bg-primary-50/40 px-4 py-3"
              >
                <div>
                  <div className="text-sm text-slate-700">{document.label}</div>
                  <div className="text-xs text-slate-500">{document.note ?? 'No note added yet.'}</div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${previewDocumentClasses[document.status]}`}
                  >
                    {document.status}
                  </span>
                  <div className="mt-1 text-xs text-slate-500">{document.uploadedAt ?? 'Not uploaded'}</div>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <aside className="space-y-6">
          <SurfaceCard className="p-6">
            <h2 className="text-lg font-semibold text-slate-950">Review notes</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{application.note}</p>
            {application.missingItems.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-amber-700">Open items</div>
                <div className="mt-2 text-sm text-amber-900">{application.missingItems.join(' · ')}</div>
              </div>
            ) : null}
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h2 className="text-lg font-semibold text-slate-950">Activity</h2>
            <div className="mt-4 space-y-3">
              {application.timeline.map((entry) => (
                <div key={`${entry.at}-${entry.title}`} className="rounded-2xl border border-primary-100 bg-primary-50/40 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-950">{entry.title}</div>
                    <div className="text-xs text-slate-500">{entry.at}</div>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{entry.detail}</div>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </aside>
      </div>
    </PreviewShell>
  );
}
