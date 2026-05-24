import { notFound } from 'next/navigation';
import { PreviewShell } from '@/components/preview-shell';
import { SectionHeading } from '@/components/section-heading';
import { StatusBadge } from '@/components/status-badge';
import { SurfaceCard } from '@/components/surface-card';
import {
  PREVIEW_REVIEW_STATE_CLASSES,
  PREVIEW_REVIEW_STATE_LABELS,
  getPreviewDocumentCounts,
  getPreviewDocumentLabel,
  getPreviewNextAction,
  getPreviewReviewState,
  getPreviewDocumentStatusLabel,
  previewApplications,
  previewDocumentClasses,
} from '@/lib/dev-preview-data';
import { isDocumentStateBlocking, isDocumentStateReviewOnly } from '@eunice-shared/documents/contracts';

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

  const reviewState = getPreviewReviewState(application);
  const counts = getPreviewDocumentCounts(application);
  const blockingDocuments = application.documents.filter((document) => isDocumentStateBlocking(document.status));
  const reviewDocuments = application.documents.filter((document) => isDocumentStateReviewOnly(document.status));

  return (
    <PreviewShell
      eyebrow="Application Preview"
      title={application.learnerName}
      description={`${application.parentName} · ${application.ref}`}
      surface="detail"
      backHref="/dev/admin"
      backLabel="Back to admin"
    >
      <div className="mb-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <SurfaceCard className="overflow-hidden border border-primary-200/70 bg-[linear-gradient(135deg,rgba(8,41,27,0.98),rgba(17,57,37,0.96)_48%,rgba(174,127,6,0.92)_100%)] p-5 text-white shadow-[0_26px_70px_rgba(11,20,12,0.18)]">
          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/70">Current status</div>
              <div className="mt-2">
                <StatusBadge status={application.status} />
              </div>
              <h2 className="display-serif mt-4 text-3xl font-semibold text-white">{application.learnerName}</h2>
              <p className="mt-2 text-sm text-white/80">{application.parentName} · {application.ref}</p>
            </div>
            <div className="rounded-3xl border border-white/18 bg-white/12 p-4 text-sm text-white shadow-[0_18px_45px_rgba(184,137,7,0.10)] backdrop-blur-md">
              <div className="text-xs uppercase tracking-[0.16em] text-white/70">Grade</div>
              <div className="mt-2 text-2xl font-semibold text-white">{application.grade}</div>
              <div className="mt-3 text-sm leading-6 text-white/85">Review-ready profile for the admissions team.</div>
            </div>
          </div>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/12 px-4 py-3 shadow-sm backdrop-blur-md">
              <div className="text-xs uppercase tracking-[0.16em] text-white/65">Application form</div>
              <div className="mt-2 text-sm font-semibold text-white">Learner record summary</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/12 px-4 py-3 shadow-sm backdrop-blur-md">
              <div className="text-xs uppercase tracking-[0.16em] text-white/65">Review focus</div>
              <div className="mt-2 text-sm font-semibold text-white">{counts.blocking > 0 ? 'Resolve blockers' : 'Confirm readiness'}</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/12 px-4 py-3 shadow-sm backdrop-blur-md">
              <div className="text-xs uppercase tracking-[0.16em] text-white/65">Next action</div>
              <div className="mt-2 text-sm font-semibold text-white">School review and document check</div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-5">
          <div className="grid gap-2.5 sm:grid-cols-3">
            <div className="rounded-2xl border border-accent-100 bg-[rgba(255,248,231,0.85)] p-3.5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Parent</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{application.parentName}</div>
            </div>
            <div className="rounded-2xl border border-accent-100 bg-[rgba(255,248,231,0.85)] p-3.5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">School year</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{application.schoolYear}</div>
            </div>
            <div className="rounded-2xl border border-accent-100 bg-[rgba(255,248,231,0.85)] p-3.5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Reviewer</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{application.assignedTo}</div>
            </div>
          </div>
          <div className="mt-3.5 rounded-2xl border border-accent-200 bg-[rgba(255,248,231,0.98)] p-3.5 text-sm leading-6 text-accent-900">
            {getPreviewNextAction(application)}
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <SurfaceCard className="p-5">
          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-accent-100 bg-[rgba(255,248,231,0.82)] p-3.5">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Parent</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{application.parentName}</div>
              <div className="mt-1 text-sm text-slate-600">{application.parentEmail}</div>
              <div className="text-sm text-slate-600">{application.parentPhone}</div>
            </div>
            <div className="rounded-2xl border border-accent-100 bg-[rgba(255,248,231,0.82)] p-3.5">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Previous school</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{application.previousSchool}</div>
              <div className="mt-1 text-sm text-slate-600">{application.schoolYear}</div>
            </div>
            <div className="rounded-2xl border border-accent-100 bg-[rgba(255,248,231,0.82)] p-3.5">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Assigned reviewer</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{application.assignedTo}</div>
              <div className="mt-1 text-sm text-slate-600">{application.completion}% complete</div>
            </div>
          </div>

          <div className="mb-5 rounded-2xl border border-primary-100 bg-white p-3.5 shadow-[0_12px_30px_rgba(31,109,58,0.06)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Review state</div>
                <div className="mt-2">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${PREVIEW_REVIEW_STATE_CLASSES[reviewState]}`}>
                    {PREVIEW_REVIEW_STATE_LABELS[reviewState]}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-500">
                <div className="rounded-2xl border border-primary-100 bg-primary-50/50 px-3 py-2">
                  <div className="font-semibold text-slate-950">{counts.ready}</div>
                  <div>Ready</div>
                </div>
                <div className="rounded-2xl border border-primary-100 bg-primary-50/50 px-3 py-2">
                  <div className="font-semibold text-slate-950">{counts.reviewOnly}</div>
                  <div>Flagged</div>
                </div>
                <div className="rounded-2xl border border-primary-100 bg-primary-50/50 px-3 py-2">
                  <div className="font-semibold text-slate-950">{counts.blocking}</div>
                  <div>Blocking</div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{getPreviewNextAction(application)}</p>
          </div>

          <SectionHeading
            title="Document checklist"
            description="This view should support fast verification decisions without overwhelming staff."
          />
          <div className="space-y-2.5">
            {application.documents.map((document) => (
              <div
                key={`${document.type}-${document.uploadedAt ?? 'missing'}`}
                className="mt-2.5 flex items-center justify-between rounded-2xl border border-primary-100 bg-primary-50/40 px-4 py-3"
              >
                <div>
                  <div className="text-sm text-slate-700">{getPreviewDocumentLabel(document.type)}</div>
                  <div className="text-xs text-slate-500">{document.note ?? 'No note added yet.'}</div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${previewDocumentClasses[document.status]}`}
                  >
                    {getPreviewDocumentStatusLabel(document.status)}
                  </span>
                  <div className="mt-1 text-xs text-slate-500">{document.uploadedAt ?? 'Not uploaded'}</div>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <aside className="space-y-5">
          <SurfaceCard className="p-5">
            <h2 className="text-lg font-semibold text-slate-950">Review notes</h2>
            <p className="mt-2.5 text-sm leading-6 text-slate-600">{application.note}</p>
            {application.missingItems.length > 0 ? (
              <div className="mt-3.5 rounded-2xl border border-accent-200 bg-accent-50 p-3.5">
                <div className="text-xs uppercase tracking-[0.16em] text-accent-700">Open items</div>
                <div className="mt-2 text-sm text-accent-900">{application.missingItems.join(' · ')}</div>
              </div>
            ) : null}
          </SurfaceCard>

          <SurfaceCard className="p-5">
            <h2 className="text-lg font-semibold text-slate-950">Triage actions</h2>
            <div className="mt-3.5 space-y-2.5 text-sm">
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
                <div className="font-semibold">{blockingDocuments.length} blocking document{blockingDocuments.length === 1 ? '' : 's'}</div>
                <div className="mt-1">
                  {blockingDocuments.length > 0
                    ? 'Request a replacement before the file can move forward.'
                    : 'No blocking document issues are stopping the application right now.'}
                </div>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
                <div className="font-semibold">{reviewDocuments.length} flagged document{reviewDocuments.length === 1 ? '' : 's'}</div>
                <div className="mt-1">
                  {reviewDocuments.length > 0
                    ? 'These can stay in the queue, but they need a staff decision.'
                    : 'No document is waiting on a manual review decision.'}
                </div>
              </div>
              <div className="rounded-2xl border border-primary-100 bg-primary-50/60 px-4 py-3 text-slate-700">
                <div className="font-semibold text-slate-950">Recommended next step</div>
                <div className="mt-1">{getPreviewNextAction(application)}</div>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-5">
            <h2 className="text-lg font-semibold text-slate-950">Activity</h2>
            <div className="mt-3.5 space-y-2.5">
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
