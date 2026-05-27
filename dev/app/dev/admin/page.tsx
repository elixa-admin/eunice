'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PreviewShell } from '@/components/preview-shell';
import { SectionHeading } from '@/components/section-heading';
import { SurfaceCard } from '@/components/surface-card';
import { StatusBadge } from '@/components/status-badge';
import { APPLICATION_NOTIFICATION_PLAN } from '@eunice-shared/domain/applications';
import {
  getAdminQueueLane,
  getPreviewDocumentCounts,
  getPreviewDocumentLabel,
  getPreviewDocumentStatusLabel,
  getPreviewNextAction,
  getPreviewReviewState,
  previewApplications,
  previewDocumentClasses,
  type PreviewApplication,
  type PreviewDocument,
} from '@/lib/dev-preview-data';
import type { ApplicationStatus } from '@eunice-shared/domain/applications';
import {
  DOCUMENT_PROCESSING_STATUS_LABELS,
  isDocumentStateBlocking,
  isDocumentStateReviewOnly,
  isDocumentStateSubmissionReady,
} from '@eunice-shared/documents/contracts';

type QueueLane = 'blocking' | 'review' | 'ready' | 'decision';

type GroupedDocuments = {
  blocking: PreviewDocument[];
  review: PreviewDocument[];
  ready: PreviewDocument[];
  other: PreviewDocument[];
};

const laneMeta = {
  blocking: {
    label: 'Blocking',
    helper: 'Hard-stop issues first',
    chip: 'border-rose-200 bg-white text-rose-700',
    row: 'border-l-rose-300 bg-rose-50/20 hover:bg-rose-50/50',
    panel: 'border-rose-200 bg-rose-50/85 text-rose-900',
  },
  review: {
    label: 'Needs review',
    helper: 'Staff judgement required',
    chip: 'border-amber-200 bg-white text-amber-700',
    row: 'border-l-amber-300 bg-amber-50/20 hover:bg-amber-50/50',
    panel: 'border-amber-200 bg-amber-50/85 text-amber-950',
  },
  ready: {
    label: 'Ready',
    helper: 'Clear to move forward',
    chip: 'border-emerald-200 bg-white text-emerald-700',
    row: 'border-l-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/50',
    panel: 'border-emerald-200 bg-emerald-50/85 text-emerald-950',
  },
  decision: {
    label: 'Finalised',
    helper: 'Outcome already recorded',
    chip: 'border-slate-200 bg-white text-slate-600',
    row: 'border-l-slate-300 bg-slate-50/20 hover:bg-slate-50/50',
    panel: 'border-slate-200 bg-slate-50/85 text-slate-900',
  },
} satisfies Record<QueueLane, { label: string; helper: string; chip: string; row: string; panel: string }>;

function groupDocuments(application: PreviewApplication): GroupedDocuments {
  return application.documents.reduce<GroupedDocuments>(
    (groups, document) => {
      if (isDocumentStateBlocking(document.status)) groups.blocking.push(document);
      else if (isDocumentStateReviewOnly(document.status)) groups.review.push(document);
      else if (isDocumentStateSubmissionReady(document.status)) groups.ready.push(document);
      else groups.other.push(document);
      return groups;
    },
    { blocking: [], review: [], ready: [], other: [] },
  );
}

function formatQueueIssue(application: PreviewApplication) {
  const counts = getPreviewDocumentCounts(application);

  if (application.status === 'accepted' || application.status === 'rejected') {
    return 'Outcome is complete';
  }

  if (counts.blocking > 0) {
    return `${counts.blocking} blocking document${counts.blocking === 1 ? '' : 's'} need replacement`;
  }

  if (counts.reviewOnly > 0) {
    return `${counts.reviewOnly} flagged item${counts.reviewOnly === 1 ? '' : 's'} need judgement`;
  }

  if (application.status === 'submitted') {
    return 'Reviewer assignment needed';
  }

  return 'File can move to the next decision';
}

export default function DevAdminPage() {
  const [selectedAppId, setSelectedAppId] = useState(previewApplications[0].id);
  const featured = previewApplications.find((app) => app.id === selectedAppId) ?? previewApplications[0];
  const reviewState = getPreviewReviewState(featured);
  const counts = getPreviewDocumentCounts(featured);
  const nextAction = getPreviewNextAction(featured);
  const groupedDocuments = useMemo(() => groupDocuments(featured), [featured]);
  const queuePriority =
    counts.blocking > 0 ? 'Clear blockers first' : counts.reviewOnly > 0 ? 'Make the reviewer call next' : reviewState === 'complete' ? 'Prepare communication handoff' : 'Move to decision';
  const notificationStatus = (featured.status === 'incomplete' ? 'awaiting_documents' : featured.status) as ApplicationStatus;
  const laneCounts = previewApplications.reduce(
    (acc, app) => {
      acc[getAdminQueueLane(app)] += 1;
      return acc;
    },
    { blocking: 0, review: 0, ready: 0, decision: 0 } as Record<QueueLane, number>,
  );
  const primaryEvidence = groupedDocuments.blocking[0] ?? groupedDocuments.review[0] ?? groupedDocuments.ready[0] ?? groupedDocuments.other[0];

  return (
    <PreviewShell
      eyebrow="Dev Preview"
      title="Admissions Operations Dashboard"
      description="A tighter admissions workbench built around decisions, not decorative status blocks."
      surface="admin"
    >
      <div className="grid gap-3 xl:grid-cols-[260px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-3">
          <SurfaceCard className="border border-primary-100/80 bg-white/90 p-3.5 shadow-[0_18px_42px_rgba(11,20,12,0.06)]">
            <div className="text-xs uppercase tracking-[0.18em] text-primary-800/70">Admissions</div>
            <div className="mt-2 text-lg font-semibold text-slate-950">Queue Review</div>
            <div className="mt-1 text-sm text-slate-600">{featured.learnerName} is selected. The queue below stays secondary until the next action is clear.</div>
          </SurfaceCard>

          <SurfaceCard className="border border-slate-100 bg-white/90 p-3.5">
            <div className="space-y-1.5 text-sm">
              {['Dashboard', 'Queue Review', 'Applications', 'Document Triage', 'Reports'].map((label, index) => (
                <div
                  key={label}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 transition ${
                    index === 1
                      ? 'border border-accent-200 bg-[rgba(255,248,231,0.96)] text-primary-950 shadow-[0_10px_24px_rgba(202,138,4,0.10)]'
                      : 'text-slate-600 hover:bg-[#f8f4e8] hover:text-slate-900'
                  }`}
                >
                  <span>{label}</span>
                  {label === 'Queue Review' ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">{previewApplications.length}</span> : null}
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="border border-slate-100 bg-white/90 p-3.5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Messages</div>
            <div className="mt-2 text-sm text-slate-600">1 unread</div>
          </SurfaceCard>
        </aside>

        <main className="min-w-0 space-y-3">
          <SurfaceCard className="overflow-hidden border border-[#0f3c28]/35 bg-[#073820] p-0 text-white shadow-[0_22px_58px_rgba(11,20,12,0.16)]">
            <div className="h-1 w-full bg-[#b88907]" />
            <div className="border-b border-white/12 px-5 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/80">
                <div className="flex flex-wrap items-center gap-2">
                  <span>Queue Review</span>
                  <span>›</span>
                  <span>{laneMeta[getAdminQueueLane(featured)].label}</span>
                  <span>›</span>
                  <span className="text-white">{featured.ref}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white">Queue overview</button>
                  <Link href={`/dev/application/${featured.id}`} className="rounded-full border border-[#e7d39a]/35 bg-[#b88907] px-4 py-2 text-sm font-semibold text-[#052716]">
                    Open full record
                  </Link>
                </div>
              </div>
            </div>
            <div className="grid gap-3 px-5 py-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.45fr)]">
              <div className="rounded-[24px] border border-[#e7d39a]/25 bg-[linear-gradient(180deg,rgba(12,75,43,0.98)_0%,rgba(7,56,32,0.98)_100%)] p-4 shadow-[0_16px_34px_rgba(0,0,0,0.16)] ring-1 ring-white/6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-[0.18em] text-[#e8dcae]">Selected application</div>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/95 text-[#073820]">
                        <span className="text-lg font-semibold">{featured.learnerName.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-3xl font-semibold text-white">{featured.learnerName}</h2>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/85">
                          <span>{featured.ref}</span>
                          <span className="rounded-full border border-white/20 bg-white/12 px-2.5 py-1 text-xs font-semibold">
                            {reviewState === 'blocked' ? 'Blocked' : reviewState === 'review' ? 'Needs review' : reviewState === 'ready' ? 'Ready' : 'Finalised'}
                          </span>
                          <span className="rounded-full border border-white/20 bg-white/12 px-2.5 py-1 text-xs font-semibold">{featured.grade}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/12 bg-white/8 px-3 py-3">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/68">Parent</div>
                        <div className="mt-1 text-sm font-medium text-white">{featured.parentName}</div>
                        <div className="mt-1 text-xs text-white/72">{featured.parentEmail}</div>
                      </div>
                      <div className="rounded-2xl border border-white/12 bg-white/8 px-3 py-3">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/68">Owner</div>
                        <div className="mt-1 text-sm font-medium text-white">{featured.assignedTo}</div>
                        <div className="mt-1 text-xs text-white/72">Updated {featured.updatedAt}</div>
                      </div>
                      <div className="rounded-2xl border border-white/12 bg-white/8 px-3 py-3">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/68">Evidence</div>
                        <div className="mt-1 text-sm font-medium text-white">{counts.ready}/{counts.total} usable now</div>
                        <div className="mt-1 text-xs text-white/72">{counts.blocking} blocking · {counts.reviewOnly} flagged</div>
                      </div>
                      <div className="rounded-2xl border border-white/12 bg-white/8 px-3 py-3 sm:col-span-3">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/68">Latest communication</div>
                        <div className="mt-1 text-sm font-medium text-white">
                          {featured.communication.at(-1)?.channel ?? 'No messages'} · {featured.communication.at(-1)?.subject ?? 'No communication yet'}
                        </div>
                        <div className="mt-1 text-xs text-white/72">
                          {featured.communication.at(-1)?.status ?? 'draft'} · {featured.communication.at(-1)?.at ?? 'No date available'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-[360px] rounded-[24px] border border-amber-200/20 bg-amber-100/10 p-4 text-sm shadow-[0_12px_26px_rgba(0,0,0,0.12)]">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#e8dcae]">Work this file next</div>
                    <div className="mt-2 text-lg font-semibold text-white">{queuePriority}</div>
                    <p className="mt-2 leading-6 text-white/86">{nextAction}</p>
                    <div className="mt-4 space-y-2.5">
                      {[
                        { label: '1. Clear blockers', active: counts.blocking > 0, helper: counts.blocking > 0 ? `${counts.blocking} issue${counts.blocking === 1 ? '' : 's'} preventing progress` : 'Nothing blocking this file' },
                        { label: '2. Review exceptions', active: counts.blocking === 0 && counts.reviewOnly > 0, helper: counts.reviewOnly > 0 ? `${counts.reviewOnly} flagged item${counts.reviewOnly === 1 ? '' : 's'} waiting on a call` : 'No flagged evidence right now' },
                        { label: '3. Advance outcome', active: counts.blocking === 0 && counts.reviewOnly === 0, helper: counts.blocking === 0 && counts.reviewOnly === 0 ? 'The file can move forward' : 'Hold until the evidence is clean' },
                      ].map((step) => (
                        <div key={step.label} className={`rounded-2xl border px-3 py-3 ${step.active ? 'border-[#e7d39a]/45 bg-white/12' : 'border-white/10 bg-white/6'}`}>
                          <div className="text-sm font-semibold text-white">{step.label}</div>
                          <div className="mt-1 text-xs leading-5 text-white/72">{step.helper}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-[24px] border border-[#e7d39a]/25 bg-[linear-gradient(180deg,rgba(17,73,47,0.99)_0%,rgba(9,62,37,0.99)_100%)] p-3.5 shadow-[0_14px_30px_rgba(0,0,0,0.16)] ring-1 ring-white/6">
                  <div className="text-xs uppercase tracking-[0.16em] text-[#e8dcae]">Queue at a glance</div>
                  <div className="mt-2.5 grid gap-2">
                    {(['blocking', 'review', 'ready', 'decision'] as const).map((key) => (
                      <div key={key} className="flex items-center justify-between rounded-xl border border-white/12 bg-white/8 px-3 py-2 text-sm text-white">
                        <div>
                          <div className="font-medium">{laneMeta[key].label}</div>
                          <div className="text-[11px] text-white/64">{laneMeta[key].helper}</div>
                        </div>
                        <span className="rounded-full border border-white/18 bg-white px-2.5 py-1 text-xs font-semibold text-slate-900">{laneCounts[key]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/12 bg-white/8 p-4 shadow-[0_14px_28px_rgba(0,0,0,0.10)]">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#e8dcae]">Primary evidence</div>
                  {primaryEvidence ? (
                    <>
                      <div className="mt-2 text-base font-semibold text-white">{getPreviewDocumentLabel(primaryEvidence.type)}</div>
                      <div className="mt-1 text-sm text-white/76">{primaryEvidence.note ?? 'No note added yet.'}</div>
                      {primaryEvidence.intake ? (
                        <div className="mt-1 text-xs text-white/68">
                          {DOCUMENT_PROCESSING_STATUS_LABELS[primaryEvidence.intake.processingStatus]}
                        </div>
                      ) : null}
                      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-white/70">
                        <span className={`inline-flex rounded-full px-2.5 py-1 font-semibold capitalize ${previewDocumentClasses[primaryEvidence.status]}`}>
                          {getPreviewDocumentStatusLabel(primaryEvidence.status)}
                        </span>
                        <span>{primaryEvidence.uploadedAt ?? 'Not uploaded'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="mt-2 text-sm text-white/76">No evidence on file yet.</div>
                  )}
                </div>

                <div className="rounded-[24px] border border-[#e7d39a]/25 bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(249,247,240,0.98)_100%)] p-4 shadow-[0_14px_28px_rgba(0,0,0,0.08)]">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Communication trail</div>
                  <div className="mt-3 space-y-2.5">
                    {featured.communication.slice(-3).map((entry) => (
                      <div key={`${entry.channel}-${entry.at}-${entry.subject}`} className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-2.5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-slate-950">{entry.subject}</div>
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                            {entry.channel}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-600">{entry.status} · {entry.at}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#e7d39a]/25 bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(249,247,240,0.98)_100%)] p-4 shadow-[0_14px_28px_rgba(0,0,0,0.08)]">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Notification plan</div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">{APPLICATION_NOTIFICATION_PLAN[notificationStatus].label}</div>
                  {APPLICATION_NOTIFICATION_PLAN[notificationStatus].templates.length > 0 ? (
                    <div className="mt-3 space-y-2.5">
                      {APPLICATION_NOTIFICATION_PLAN[notificationStatus].templates.map((template) => (
                        <div key={`${template.channel}-${template.subject}`} className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-2.5">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-semibold text-slate-950">{template.subject}</div>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                              {template.channel}
                            </span>
                          </div>
                          <div className="mt-1 text-xs leading-5 text-slate-600">{template.body}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-slate-600">No automatic message is scheduled for this state yet.</div>
                  )}
                </div>
              </div>
            </div>
          </SurfaceCard>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
            <SurfaceCard className="overflow-hidden border border-slate-100 bg-white/92 p-0 shadow-[0_18px_40px_rgba(11,20,12,0.06)]">
              <div className="border-b border-slate-100 bg-[#faf7ef] px-6 py-4">
                <SectionHeading title="Worklist" description="Read the issue column first. Open the record only when the next action needs full evidence." />
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-900 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                    <tr>
                      <th className="px-6 py-3.5">Application</th>
                      <th className="px-6 py-3.5">Issue</th>
                      <th className="px-6 py-3.5">Owner</th>
                      <th className="px-6 py-3.5">Next action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {previewApplications.map((app) => {
                      const appLane = getAdminQueueLane(app);
                      const isSelected = app.id === selectedAppId;
                      return (
                        <tr
                          key={app.id}
                          onClick={() => setSelectedAppId(app.id)}
                          className={`cursor-pointer border-l-4 transition ${
                            isSelected
                              ? 'border-l-accent-500 bg-[rgba(255,248,231,0.82)] shadow-[inset_0_0_0_1px_rgba(202,138,4,0.12)]'
                              : laneMeta[appLane].row
                          }`}
                        >
                          <td className="px-6 py-3.5 align-top">
                            <div className="font-semibold text-slate-950">{app.learnerName}</div>
                            <div className="mt-1 text-xs text-slate-500">{app.ref} · {app.grade}</div>
                          </td>
                          <td className="px-6 py-3.5 align-top">
                            <div className="font-medium text-slate-950">{formatQueueIssue(app)}</div>
                            <div className="mt-1 text-xs text-slate-500">Updated {app.updatedAt}</div>
                          </td>
                          <td className="px-6 py-3.5 align-top">
                            <div className="text-sm font-medium text-slate-900">{app.assignedTo}</div>
                            <div className="mt-1">
                              <StatusBadge status={app.status} />
                            </div>
                          </td>
                          <td className="px-6 py-3.5 align-top text-sm text-slate-700">{getPreviewNextAction(app)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </SurfaceCard>

            <div className="space-y-3">
              <SurfaceCard className="border border-slate-100 bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(249,247,240,0.98)_100%)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Evidence snapshot</div>
                    <div className="mt-1 text-sm text-slate-600">Keep this panel short: what is blocked, what needs judgement, and what is safe.</div>
                  </div>
                  <Link href={`/dev/application/${featured.id}`} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900">
                    Full record
                  </Link>
                </div>

                <div className="mt-3.5 space-y-3">
                  {([
                    ['blocking', groupedDocuments.blocking],
                    ['review', groupedDocuments.review],
                    ['ready', groupedDocuments.ready],
                  ] as const).map(([key, docs]) => (
                    <div key={key} className={`rounded-2xl border p-3 ${laneMeta[key].panel}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-[0.16em] opacity-75">{laneMeta[key].label}</div>
                          <div className="mt-1 text-sm font-semibold">{docs.length === 0 ? 'Nothing sitting here' : `${docs.length} document${docs.length === 1 ? '' : 's'}`}</div>
                        </div>
                        <span className="rounded-full border border-current/15 bg-white/70 px-2.5 py-1 text-xs font-semibold">{docs.length}</span>
                      </div>
                      {docs.length > 0 ? (
                        <div className="mt-2.5 space-y-2">
                          {docs.slice(0, 2).map((document) => (
                            <div key={`${key}-${document.type}-${document.uploadedAt ?? 'missing'}`} className="rounded-xl border border-current/10 bg-white/60 px-3 py-2.5">
                              <div className="text-sm font-semibold text-slate-950">{getPreviewDocumentLabel(document.type)}</div>
                              <div className="mt-1 text-xs leading-5 text-slate-600">{document.note ?? 'No note yet.'}</div>
                              {document.intake ? (
                                <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                                  {DOCUMENT_PROCESSING_STATUS_LABELS[document.intake.processingStatus]}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </SurfaceCard>

              <SurfaceCard className="border border-slate-100 bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(249,247,240,0.98)_100%)] p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Case context</div>
                <div className="mt-3 space-y-2.5 text-sm text-slate-700">
                  <div className="rounded-2xl border border-slate-200 bg-[#fbf8f0] px-4 py-3">
                    <div className="font-semibold text-slate-950">Open items</div>
                    <div className="mt-1">{featured.missingItems.length > 0 ? featured.missingItems.join(' · ') : 'No open items are blocking the file outside the evidence list.'}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-[#fbf8f0] px-4 py-3">
                    <div className="font-semibold text-slate-950">Latest movement</div>
                    <div className="mt-1">{featured.timeline.at(-1)?.title ?? 'No activity yet.'}</div>
                    <div className="mt-1 text-xs text-slate-500">{featured.timeline.at(-1)?.detail ?? ''}</div>
                  </div>
                </div>
              </SurfaceCard>
            </div>
          </div>
        </main>
      </div>
    </PreviewShell>
  );
}
