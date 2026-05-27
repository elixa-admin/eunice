import { notFound } from 'next/navigation';
import { PreviewShell } from '@/components/preview-shell';
import { SectionHeading } from '@/components/section-heading';
import { StatusBadge } from '@/components/status-badge';
import { SurfaceCard } from '@/components/surface-card';
import { APPLICATION_NOTIFICATION_PLAN } from '@eunice-shared/domain/applications';
import {
  PREVIEW_REVIEW_STATE_CLASSES,
  PREVIEW_REVIEW_STATE_LABELS,
  getPreviewDocumentCounts,
  getPreviewDocumentLabel,
  getPreviewDocumentStatusLabel,
  getPreviewNextAction,
  getPreviewReviewState,
  previewApplications,
  previewDocumentClasses,
} from '@/lib/dev-preview-data';
import type { ApplicationStatus } from '@eunice-shared/domain/applications';
import { isDocumentStateBlocking, isDocumentStateReviewOnly, isDocumentStateSubmissionReady } from '@eunice-shared/documents/contracts';

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
  const nextAction = getPreviewNextAction(application);
  const blockingDocuments = application.documents.filter((document) => isDocumentStateBlocking(document.status));
  const reviewDocuments = application.documents.filter((document) => isDocumentStateReviewOnly(document.status));
  const readyDocuments = application.documents.filter((document) => isDocumentStateSubmissionReady(document.status));
  const readinessTone = counts.blocking > 0 ? 'rose' : counts.reviewOnly > 0 ? 'amber' : 'emerald';
  const notificationStatus = (application.status === 'incomplete' ? 'awaiting_documents' : application.status) as ApplicationStatus;

  return (
    <PreviewShell
      eyebrow="Application Preview"
      title={application.learnerName}
      description={`${application.parentName} · ${application.ref}`}
      surface="detail"
      backHref="/dev/admin"
      backLabel="Back to admin"
    >
      <div className="mb-5 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <SurfaceCard className="overflow-hidden border border-[#0f3c28]/35 bg-[#073820] p-0 text-white shadow-[0_22px_58px_rgba(11,20,12,0.16)]">
          <div className="h-1 w-full bg-[#b88907]" />
          <div className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-[#e8dcae]">Selected application</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="rounded-full border border-white/20 bg-white/95 px-3 py-1.5 text-sm font-semibold text-[#073820]">
                    {application.ref}
                  </div>
                  <StatusBadge status={application.status} />
                </div>
                <h2 className="display-serif mt-4 text-3xl font-semibold text-white">{application.learnerName}</h2>
                <p className="mt-2 text-sm text-white/80">{application.parentName} · {application.grade} · {application.schoolYear}</p>
              </div>

              <div className="w-full max-w-[360px] rounded-[24px] border border-amber-200/20 bg-amber-100/10 p-4 text-sm shadow-[0_12px_26px_rgba(0,0,0,0.12)]">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#e8dcae]">Decision guidance</div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {counts.blocking > 0 ? 'Clear blockers first' : counts.reviewOnly > 0 ? 'Resolve flagged evidence' : 'Ready to move forward'}
                </div>
                <p className="mt-2 leading-6 text-white/86">{nextAction}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-white/80">
                  <div className="rounded-2xl border border-white/12 bg-white/8 px-2 py-2.5">
                    <div className="text-base font-semibold text-white">{counts.blocking}</div>
                    <div>Blocking</div>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/8 px-2 py-2.5">
                    <div className="text-base font-semibold text-white">{counts.reviewOnly}</div>
                    <div>Flagged</div>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/8 px-2 py-2.5">
                    <div className="text-base font-semibold text-white">{counts.ready}</div>
                    <div>Ready</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-4">
              <div className="rounded-2xl border border-[#e7d39a]/25 bg-[#11492f] px-4 py-3 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#e8dcae]">Parent</div>
                <div className="mt-2 text-base font-semibold text-white">{application.parentName}</div>
                <div className="mt-1 text-xs text-white/72">{application.parentEmail}</div>
              </div>
              <div className="rounded-2xl border border-[#e7d39a]/25 bg-[#11492f] px-4 py-3 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#e8dcae]">Reviewer</div>
                <div className="mt-2 text-base font-semibold text-white">{application.assignedTo}</div>
                <div className="mt-1 text-xs text-white/72">Submitted {application.submittedAt}</div>
              </div>
              <div className="rounded-2xl border border-[#e7d39a]/25 bg-[#11492f] px-4 py-3 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#e8dcae]">Previous school</div>
                <div className="mt-2 text-base font-semibold text-white">{application.previousSchool}</div>
                <div className="mt-1 text-xs text-white/72">{application.completion}% complete</div>
              </div>
              <div className="rounded-2xl border border-[#e7d39a]/25 bg-[#11492f] px-4 py-3 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#e8dcae]">Review state</div>
                <div className="mt-2">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${PREVIEW_REVIEW_STATE_CLASSES[reviewState]}`}>
                    {PREVIEW_REVIEW_STATE_LABELS[reviewState]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-5">
          <div className={`mb-4 h-1 rounded-full ${readinessTone === 'rose' ? 'bg-rose-500' : readinessTone === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Case summary</div>
          <div className="mt-3 space-y-2.5 text-sm text-slate-700">
            <div className="rounded-2xl border border-slate-200 bg-[#fbf8f0] px-4 py-3">
              <div className="font-semibold text-slate-950">Next move</div>
              <div className="mt-1">{nextAction}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-[#fbf8f0] px-4 py-3">
              <div className="font-semibold text-slate-950">Open items</div>
              <div className="mt-1">{application.missingItems.length > 0 ? application.missingItems.join(' · ') : 'No extra items are blocking the file outside the evidence list.'}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-[#fbf8f0] px-4 py-3">
              <div className="font-semibold text-slate-950">Latest movement</div>
              <div className="mt-1">{application.timeline.at(-1)?.title ?? 'No recent activity recorded.'}</div>
              <div className="mt-1 text-xs text-slate-500">{application.timeline.at(-1)?.detail ?? ''}</div>
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <SurfaceCard className="p-5">
          <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm leading-6 ${
            readinessTone === 'rose'
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : readinessTone === 'amber'
                ? 'border-amber-200 bg-amber-50 text-amber-900'
                : 'border-emerald-200 bg-emerald-50 text-emerald-900'
          }`}>
            <div className="text-xs uppercase tracking-[0.16em] opacity-80">Decision lens</div>
            <div className="mt-1 font-medium">
              {counts.blocking > 0
                ? 'This file stops here until the blocking evidence is repaired.'
                : counts.reviewOnly > 0
                  ? 'The file can stay in motion, but the flagged evidence needs a reviewer decision.'
                  : 'Nothing is holding the file back. Move it to the next decision.'}
            </div>
          </div>

          <SectionHeading title="Evidence by state" description="Keep the reviewer in one rhythm: blockers, flagged evidence, then safe documents." />

          <div className="mt-4 space-y-4">
            {[
              {
                label: 'Blocking evidence',
                helper: 'Repair or replace these first.',
                tone: 'border-rose-200 bg-rose-50/75',
                documents: blockingDocuments,
              },
              {
                label: 'Flagged evidence',
                helper: 'These need a judgement call from staff.',
                tone: 'border-amber-200 bg-amber-50/75',
                documents: reviewDocuments,
              },
              {
                label: 'Usable evidence',
                helper: 'These documents are safe for the current review.',
                tone: 'border-emerald-200 bg-emerald-50/75',
                documents: readyDocuments,
              },
            ].map((section) => (
              <div key={section.label} className={`rounded-3xl border p-4 ${section.tone}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-600">{section.label}</div>
                    <div className="mt-1 text-sm text-slate-700">{section.helper}</div>
                  </div>
                  <span className="rounded-full border border-current/10 bg-white/75 px-2.5 py-1 text-xs font-semibold text-slate-900">{section.documents.length}</span>
                </div>

                {section.documents.length > 0 ? (
                  <div className="mt-3 space-y-2.5">
                    {section.documents.map((document) => (
                      <div key={`${section.label}-${document.type}-${document.uploadedAt ?? 'missing'}`} className="flex items-center justify-between rounded-2xl border border-white/75 bg-white/70 px-4 py-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-950">{getPreviewDocumentLabel(document.type)}</div>
                          <div className="mt-1 text-xs text-slate-700">{document.note ?? 'No note added yet.'}</div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${previewDocumentClasses[document.status]}`}>
                            {getPreviewDocumentStatusLabel(document.status)}
                          </span>
                          <div className="mt-1 text-xs text-slate-500">{document.uploadedAt ?? 'Not uploaded'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-3 text-sm text-slate-600">
                    Nothing is currently sitting in this bucket.
                  </div>
                )}
              </div>
            ))}
          </div>
        </SurfaceCard>

        <aside className="space-y-5">
          <SurfaceCard className="bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(250,247,240,0.98)_100%)] p-5">
            <h2 className="text-lg font-semibold text-slate-950">Reviewer notes</h2>
            <p className="mt-2.5 text-sm leading-6 text-slate-700">{application.note}</p>
            {application.missingItems.length > 0 ? (
              <div className="mt-3.5 rounded-2xl border border-accent-200 bg-accent-50 p-3.5">
                <div className="text-xs uppercase tracking-[0.16em] text-accent-700">Open items</div>
                <div className="mt-2 text-sm text-[#3a2b07]">{application.missingItems.join(' · ')}</div>
              </div>
            ) : null}
          </SurfaceCard>

          <SurfaceCard className="bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(249,247,240,0.98)_100%)] p-5">
            <h2 className="text-lg font-semibold text-slate-950">Communication trail</h2>
            <p className="mt-2.5 text-sm leading-6 text-slate-700">Keep the latest parent contact visible alongside the review so the file tells one coherent story.</p>
            <div className="mt-3.5 space-y-2.5">
              {application.communication.slice(-3).map((entry) => (
                <div key={`${entry.channel}-${entry.at}-${entry.subject}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">{entry.subject}</div>
                      <div className="mt-1 text-xs text-slate-600">{entry.detail}</div>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                      {entry.channel}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                    <span>{entry.status}</span>
                    <span>{entry.at}</span>
                  </div>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(249,247,240,0.98)_100%)] p-5">
            <h2 className="text-lg font-semibold text-slate-950">Notification plan</h2>
            <p className="mt-2.5 text-sm leading-6 text-slate-700">This shows the lightweight message shape we can eventually wire into automation.</p>
            <div className="mt-3.5 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Current state</div>
              <div className="mt-1 text-sm font-semibold text-slate-950">{APPLICATION_NOTIFICATION_PLAN[notificationStatus].label}</div>
            </div>
            <div className="mt-3.5 space-y-2.5">
              {APPLICATION_NOTIFICATION_PLAN[notificationStatus].templates.length > 0 ? (
                APPLICATION_NOTIFICATION_PLAN[notificationStatus].templates.map((template) => (
                  <div key={`${template.channel}-${template.subject}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-slate-950">{template.subject}</div>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                        {template.channel}
                      </span>
                    </div>
                    <div className="mt-1 text-xs leading-5 text-slate-600">{template.body}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-3 text-sm text-slate-600">
                  No automatic notification is scheduled for this state yet.
                </div>
              )}
            </div>
          </SurfaceCard>

          <SurfaceCard className="bg-[linear-gradient(180deg,rgba(255,251,243,0.99)_0%,rgba(250,246,236,0.98)_100%)] p-5">
            <h2 className="text-lg font-semibold text-slate-950">Triage summary</h2>
            <div className="mt-3 space-y-2.5 text-sm">
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
                <div className="font-semibold">{blockingDocuments.length} blocking document{blockingDocuments.length === 1 ? '' : 's'}</div>
                <div className="mt-1 text-slate-700">
                  {blockingDocuments.length > 0 ? 'These stop the file from progressing.' : 'Nothing is blocking the file right now.'}
                </div>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
                <div className="font-semibold">{reviewDocuments.length} flagged document{reviewDocuments.length === 1 ? '' : 's'}</div>
                <div className="mt-1 text-slate-700">
                  {reviewDocuments.length > 0 ? 'These need a reviewer call.' : 'No flagged evidence is waiting on a decision.'}
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
                <div className="font-semibold">{readyDocuments.length} ready document{readyDocuments.length === 1 ? '' : 's'}</div>
                <div className="mt-1 text-slate-700">These can support the current decision immediately.</div>
              </div>
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
          </SurfaceCard>
        </aside>
      </div>
    </PreviewShell>
  );
}
