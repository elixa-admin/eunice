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
  const nextAction = getPreviewNextAction(application);
  const readinessTone =
    counts.blocking > 0 ? 'rose' : counts.reviewOnly > 0 ? 'amber' : 'emerald';

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
        <SurfaceCard className="overflow-hidden border border-[#0f3c28]/35 bg-[#073820] p-0 text-white shadow-[0_22px_58px_rgba(11,20,12,0.16)]">
          <div className="h-1 w-full bg-[#b88907]" />
          <div className="p-5">
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-[#e8dcae]">Current status</div>
                <div className="mt-2">
                  <StatusBadge status={application.status} />
                </div>
                <h2 className="display-serif mt-4 text-3xl font-semibold text-white">{application.learnerName}</h2>
                <p className="mt-2 text-sm text-white/80">{application.parentName} · {application.ref}</p>
              </div>
              <div className="rounded-3xl border border-[#e7d39a]/25 bg-[linear-gradient(180deg,rgba(17,73,47,0.99)_0%,rgba(8,58,36,0.99)_100%)] p-4 text-sm text-white shadow-[0_18px_45px_rgba(184,137,7,0.10)] ring-1 ring-white/5">
                <div className="text-xs uppercase tracking-[0.16em] text-[#e8dcae]">For reviewers</div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {counts.blocking > 0 ? 'Needs immediate repair' : counts.reviewOnly > 0 ? 'Needs reviewer judgement' : 'Ready for progression'}
                </div>
                <div className="mt-3 text-sm leading-6 text-white/90">{nextAction}</div>
                <div className="mt-3 rounded-2xl border border-white/12 bg-white/8 px-3 py-2 text-xs leading-5 text-white/78">
                  The page should make the next decision obvious: fix, review, or move forward. Everything else is supporting detail.
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-2.5 sm:grid-cols-4">
              <div className="rounded-2xl border border-[#e7d39a]/25 bg-[#11492f] px-4 py-3 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#e8dcae]">Grade</div>
                <div className="mt-2 text-base font-semibold text-white">{application.grade}</div>
                <div className="mt-1 text-xs text-white/72">{application.schoolYear}</div>
              </div>
              <div className="rounded-2xl border border-[#e7d39a]/25 bg-[#11492f] px-4 py-3 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#e8dcae]">Blocking</div>
                <div className="mt-2 text-base font-semibold text-white">{counts.blocking}</div>
                <div className="mt-1 text-xs text-white/72">Must be cleared first</div>
              </div>
              <div className="rounded-2xl border border-[#e7d39a]/25 bg-[#11492f] px-4 py-3 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#e8dcae]">Flagged</div>
                <div className="mt-2 text-base font-semibold text-white">{counts.reviewOnly}</div>
                <div className="mt-1 text-xs text-white/72">Waiting on staff decision</div>
              </div>
              <div className="rounded-2xl border border-[#e7d39a]/25 bg-[#11492f] px-4 py-3 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#e8dcae]">Ready</div>
                <div className="mt-2 text-base font-semibold text-white">{counts.ready}</div>
                <div className="mt-1 text-xs text-white/72">Usable in current review</div>
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-5">
          <div className={`mb-4 h-1 rounded-full ${
            readinessTone === 'rose' ? 'bg-rose-500' : readinessTone === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
          }`} />
          <div className="grid gap-2.5 sm:grid-cols-3">
            <div className="rounded-2xl border border-accent-100 bg-[#fffdf8] p-3.5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-700">Parent</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{application.parentName}</div>
              <div className="mt-1 text-xs text-slate-600">{application.parentEmail}</div>
            </div>
            <div className="rounded-2xl border border-accent-100 bg-[#fffdf8] p-3.5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-700">Previous school</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{application.previousSchool}</div>
              <div className="mt-1 text-xs text-slate-600">{application.schoolYear}</div>
            </div>
            <div className="rounded-2xl border border-accent-100 bg-[#fffdf8] p-3.5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-700">Reviewer</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{application.assignedTo}</div>
              <div className="mt-1 text-xs text-slate-600">{application.submittedAt} submitted</div>
            </div>
          </div>
          <div className={`mt-3.5 rounded-2xl border p-3.5 text-sm leading-6 ${
            readinessTone === 'rose'
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : readinessTone === 'amber'
                ? 'border-amber-200 bg-amber-50 text-amber-900'
                : 'border-emerald-200 bg-emerald-50 text-emerald-900'
          }`}>
            <div className="text-xs uppercase tracking-[0.16em] opacity-80">Recommended move</div>
            <div className="mt-1">{nextAction}</div>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <SurfaceCard className="p-5">
          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-accent-100 bg-[#fffdf8] p-3.5">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-700">Parent</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{application.parentName}</div>
              <div className="mt-1 text-sm text-slate-700">{application.parentEmail}</div>
              <div className="text-sm text-slate-700">{application.parentPhone}</div>
            </div>
            <div className="rounded-2xl border border-accent-100 bg-[#fffdf8] p-3.5">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-700">Previous school</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{application.previousSchool}</div>
              <div className="mt-1 text-sm text-slate-700">{application.schoolYear}</div>
            </div>
            <div className="rounded-2xl border border-accent-100 bg-[#fffdf8] p-3.5">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-700">Assigned reviewer</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{application.assignedTo}</div>
              <div className="mt-1 text-sm text-slate-700">{application.completion}% complete</div>
            </div>
          </div>

          <div className="mb-5 rounded-2xl border border-primary-100 bg-white p-3.5 shadow-[0_12px_30px_rgba(31,109,58,0.06)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-slate-700">Review state</div>
                <div className="mt-2">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${PREVIEW_REVIEW_STATE_CLASSES[reviewState]}`}>
                    {PREVIEW_REVIEW_STATE_LABELS[reviewState]}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-700">
                <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] px-3 py-2">
                  <div className="font-semibold text-slate-950">{counts.ready}</div>
                  <div>Ready</div>
                </div>
                <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] px-3 py-2">
                  <div className="font-semibold text-slate-950">{counts.reviewOnly}</div>
                  <div>Flagged</div>
                </div>
                <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] px-3 py-2">
                  <div className="font-semibold text-slate-950">{counts.blocking}</div>
                  <div>Blocking</div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{nextAction}</p>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-[#fbf8f0] px-3 py-2 text-sm leading-6 text-slate-700">
              This record view should support a quick decision. Status comes first, evidence sits below, and the action should be visible without hunting.
            </div>
          </div>

          <SectionHeading
            title="Document checklist"
            description="This view should support fast verification decisions without overwhelming staff."
          />
          <div className="space-y-2.5">
            {application.documents.map((document) => (
              <div
                key={`${document.type}-${document.uploadedAt ?? 'missing'}`}
                className={`mt-2.5 flex items-center justify-between rounded-2xl border px-4 py-3 ${
                  document.status === 'verified' || document.status === 'accepted'
                    ? 'border-emerald-200 bg-emerald-50/70'
                    : isDocumentStateReviewOnly(document.status)
                      ? 'border-amber-200 bg-amber-50/70'
                      : 'border-rose-200 bg-rose-50/70'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold text-slate-950">{getPreviewDocumentLabel(document.type)}</div>
                  <div className="text-xs text-slate-700">{document.note ?? 'No note added yet.'}</div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${previewDocumentClasses[document.status]}`}
                  >
                    {getPreviewDocumentStatusLabel(document.status)}
                  </span>
                  <div className="mt-1 text-xs text-slate-700">{document.uploadedAt ?? 'Not uploaded'}</div>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <aside className="space-y-5">
          <SurfaceCard className="bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(250,247,240,0.98)_100%)] p-5">
            <h2 className="text-lg font-semibold text-slate-950">Decision notes</h2>
            <p className="mt-2.5 text-sm leading-6 text-slate-700">{application.note}</p>
            {application.missingItems.length > 0 ? (
              <div className="mt-3.5 rounded-2xl border border-accent-200 bg-accent-50 p-3.5">
                <div className="text-xs uppercase tracking-[0.16em] text-accent-700">Open items</div>
                <div className="mt-2 text-sm text-[#3a2b07]">{application.missingItems.join(' · ')}</div>
              </div>
            ) : null}
            <div className="mt-3.5 rounded-2xl border border-primary-100 bg-[#fffdf8] p-3.5 text-sm leading-6 text-slate-700">
              Keep this panel focused on the human decision, not on repeating the same status wording from above.
            </div>
          </SurfaceCard>

          <SurfaceCard className="bg-[linear-gradient(180deg,rgba(255,251,243,0.99)_0%,rgba(250,246,236,0.98)_100%)] p-5">
            <h2 className="text-lg font-semibold text-slate-950">Triage actions</h2>
            <div className="mt-3.5 space-y-2.5 text-sm">
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
                <div className="font-semibold">{blockingDocuments.length} blocking document{blockingDocuments.length === 1 ? '' : 's'}</div>
                <div className="mt-1 text-slate-700">
                  {blockingDocuments.length > 0
                    ? 'Request a replacement before the file can move forward.'
                    : 'No blocking document issues are stopping the application right now.'}
                </div>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
                <div className="font-semibold">{reviewDocuments.length} flagged document{reviewDocuments.length === 1 ? '' : 's'}</div>
                <div className="mt-1 text-slate-700">
                  {reviewDocuments.length > 0
                    ? 'These can stay in the queue, but they need a staff decision.'
                    : 'No document is waiting on a manual review decision.'}
                </div>
              </div>
              <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] px-4 py-3 text-slate-700">
                <div className="font-semibold text-slate-950">Recommended next step</div>
                <div className="mt-1 text-slate-700">{nextAction}</div>
              </div>
            </div>
            <div className="mt-3.5 rounded-2xl border border-slate-200 bg-[#fbf8f0] px-4 py-3 text-sm leading-6 text-slate-700">
              The triage panel should answer one question fast: what stops the file, and what can move right now?
            </div>
          </SurfaceCard>

          <SurfaceCard className="bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(249,247,240,0.98)_100%)] p-5">
            <h2 className="text-lg font-semibold text-slate-950">Activity</h2>
            <div className="mt-3.5 space-y-2.5">
              {application.timeline.map((entry) => (
                <div
                  key={`${entry.at}-${entry.title}`}
                  className={`rounded-2xl border px-4 py-3 ${
                    entry.title.toLowerCase().includes('submitted')
                      ? 'border-emerald-200 bg-emerald-50/70'
                      : entry.title.toLowerCase().includes('review')
                        ? 'border-amber-200 bg-amber-50/70'
                        : 'border-primary-100 bg-[#fbf8f0]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-950">{entry.title}</div>
                    <div className="text-xs text-slate-600">{entry.at}</div>
                  </div>
                  <div className="mt-1 text-sm text-slate-700">{entry.detail}</div>
                </div>
              ))}
            </div>
            <div className="mt-3.5 rounded-2xl border border-slate-200 bg-[#fbf8f0] px-4 py-3 text-sm leading-6 text-slate-700">
              Recent activity is there for context, but the action panels above should stay more prominent than the log.
            </div>
          </SurfaceCard>
        </aside>
      </div>
    </PreviewShell>
  );
}
