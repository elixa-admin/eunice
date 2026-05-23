'use client';

import { useState } from 'react';
import { PreviewShell } from '@/components/preview-shell';
import { SectionHeading } from '@/components/section-heading';
import { StatusBadge } from '@/components/status-badge';
import { SurfaceCard } from '@/components/surface-card';
import {
  getAdminQueueLane,
  PREVIEW_REVIEW_STATE_CLASSES,
  PREVIEW_REVIEW_STATE_LABELS,
  getPreviewDocumentCounts,
  getPreviewDocumentLabel,
  getPreviewNextAction,
  getPreviewReviewState,
  getPreviewDocumentStatusLabel,
  previewApplications,
} from '@/lib/dev-preview-data';
import Link from 'next/link';

const adminLaneMeta = {
  blocking: {
    label: 'Blocking',
    helper: 'Missing documents or hard stops',
    cardClass: 'border-rose-200 bg-rose-50/80 text-rose-950 shadow-[0_16px_36px_rgba(225,29,72,0.08)]',
    chipClass: 'border-rose-200 bg-white text-rose-700',
    rowClass: 'border-l-rose-300 bg-rose-50/20 hover:bg-rose-50/50',
    barClass: 'bg-rose-500',
    progressClass: 'bg-rose-100',
  },
  review: {
    label: 'Needs review',
    helper: 'Waiting on a staff decision',
    cardClass: 'border-amber-200 bg-amber-50/80 text-amber-950 shadow-[0_16px_36px_rgba(217,119,6,0.08)]',
    chipClass: 'border-amber-200 bg-white text-amber-700',
    rowClass: 'border-l-amber-300 bg-amber-50/20 hover:bg-amber-50/50',
    barClass: 'bg-amber-500',
    progressClass: 'bg-amber-100',
  },
  ready: {
    label: 'Ready',
    helper: 'Clear for the next step',
    cardClass: 'border-emerald-200 bg-emerald-50/80 text-emerald-950 shadow-[0_16px_36px_rgba(16,185,129,0.08)]',
    chipClass: 'border-emerald-200 bg-white text-emerald-700',
    rowClass: 'border-l-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/50',
    barClass: 'bg-emerald-500',
    progressClass: 'bg-emerald-100',
  },
  decision: {
    label: 'Decision',
    helper: 'Accepted or rejected outcomes',
    cardClass: 'border-slate-200 bg-slate-50/80 text-slate-950 shadow-[0_16px_36px_rgba(71,85,105,0.08)]',
    chipClass: 'border-slate-200 bg-white text-slate-600',
    rowClass: 'border-l-slate-300 bg-slate-50/20 hover:bg-slate-50/50',
    barClass: 'bg-slate-500',
    progressClass: 'bg-slate-100',
  },
} satisfies Record<
  'blocking' | 'review' | 'ready' | 'decision',
  {
    label: string;
    helper: string;
    cardClass: string;
    chipClass: string;
    rowClass: string;
    barClass: string;
    progressClass: string;
  }
>;

export default function DevAdminPage() {
  const [selectedAppId, setSelectedAppId] = useState<string>(previewApplications[0].id);

  const featured = previewApplications.find((app) => app.id === selectedAppId) || previewApplications[0];
  const featuredReviewState = getPreviewReviewState(featured);
  const featuredCounts = getPreviewDocumentCounts(featured);
  const featuredLane =
    featuredReviewState === 'blocked'
      ? 'blocking'
      : featuredReviewState === 'review'
        ? 'review'
        : featuredReviewState === 'ready'
          ? 'ready'
          : 'decision';

  const laneCounts = previewApplications.reduce(
    (acc, app) => {
      acc[getAdminQueueLane(app)] += 1;
      return acc;
    },
    {
      blocking: 0,
      review: 0,
      ready: 0,
      decision: 0,
    } as Record<'blocking' | 'review' | 'ready' | 'decision', number>,
  );

  const totals = {
    total: previewApplications.length,
  };

  const laneTotal = totals.total || 1;

  // Custom actionability helper for sidebar detail
  const featuredActionLabel = 
    featuredReviewState === 'blocked' 
      ? 'Waiting on Parent' 
      : featuredReviewState === 'review' 
        ? 'Needs Staff Verification' 
        : featuredReviewState === 'ready' 
          ? 'Ready for Decision' 
          : 'Finalized';

  return (
    <PreviewShell
      eyebrow="Dev Preview"
      title="Admissions Operations Dashboard"
      description="A focused operations surface for admissions staff, with clearer queue health, document risk, and decision readiness."
      surface="admin"
    >
      <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard className="overflow-hidden border border-emerald-900/15 bg-[linear-gradient(135deg,#063f2a_0%,#0b5b3d_58%,#b89214_100%)] p-7 text-white shadow-xl shadow-emerald-950/15">
          <p className="text-[10px] uppercase font-semibold tracking-[0.18em] text-white/75">Operations at a glance</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-white">
            Queue health, document risk, and decision readiness
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/88">
            Staff can scan the intake queue by action state, then load a record into the review panel without losing context.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatCard label="Total Applications" value={totals.total.toString()} tone="emerald" />
            <StatCard label="Needs Review" value={laneCounts.review.toString()} tone="amber" />
            <StatCard label="Blocking Cases" value={laneCounts.blocking.toString()} tone="slate" />
          </div>
        </SurfaceCard>

        <SurfaceCard className="flex flex-col justify-between border border-amber-500/15 bg-white p-7 shadow-lg shadow-slate-200/60">
          <div>
            <p className="text-[10px] uppercase font-semibold tracking-[0.16em] text-emerald-800">Queue Insights</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 shadow-sm">
                <div className="text-[10px] uppercase font-semibold tracking-[0.12em] text-slate-500">Decision-ready queue</div>
                <div className="mt-1.5 text-2xl font-semibold text-slate-950">{laneCounts.ready}</div>
              </div>
              <div className="rounded-lg border border-amber-500/15 bg-amber-50/70 p-4 text-xs leading-5 text-slate-700 shadow-sm">
                <strong>Dynamic queue lanes:</strong> submissions split into actionable queues based on document audit outcomes rather than static form status.
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-4 border-t border-slate-100 pt-4">
            Eunice High School Intake Platform · Phase 1
          </div>
        </SurfaceCard>
      </div>

      {/* Progress Cards per lane */}
      <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {(Object.keys(adminLaneMeta) as Array<keyof typeof adminLaneMeta>).map((lane) => {
          const meta = adminLaneMeta[lane];
          const count = laneCounts[lane];
          const progress = Math.max(4, Math.round((count / laneTotal) * 100));

          return (
            <SurfaceCard key={lane} className={`overflow-hidden rounded-lg border p-0 ${meta.cardClass} transition-transform duration-300 hover:-translate-y-0.5`}>
              <div className="h-1.5 bg-white/60">
                <div className={`h-full ${meta.barClass}`} style={{ width: `${progress}%` }} />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase font-semibold tracking-[0.12em] text-current/60">{meta.label}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-current">{count}</h3>
                  </div>
                  <span className={`rounded-md border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] ${meta.chipClass}`}>
                    {progress}%
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-current/70">{meta.helper}</p>
                <div className={`mt-4 h-1.5 w-full overflow-hidden rounded-full ${meta.progressClass}`}>
                  <div className={`h-full rounded-full ${meta.barClass}`} style={{ width: `${progress}%` }} />
                </div>
              </div>
            </SurfaceCard>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
        {/* Table Queue Card */}
        <SurfaceCard className="overflow-hidden border-slate-100 shadow-lg p-0">
          <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
            <SectionHeading
              title="Admissions Queue"
              description="Click any row below to swap files and load details into the review deck."
              action={(
                <div className="rounded-md border border-emerald-900/10 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Realtime Sync Active
                </div>
              )}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-900 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/80">
                <tr>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Learner</th>
                  <th className="px-6 py-4">Parent</th>
                  <th className="px-6 py-4">Grade</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Document Health / Action State</th>
                  <th className="px-6 py-4">Assigned</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Updated</th>
                  <th className="px-6 py-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {previewApplications.map((app) => {
                  const lane = getAdminQueueLane(app);
                  const laneMeta = adminLaneMeta[lane];
                  const reviewState = getPreviewReviewState(app);
                  const counts = getPreviewDocumentCounts(app);
                  const isSelected = app.id === selectedAppId;

                  // Custom actionability stuck state chip mapping
                  const actionLabel = 
                    reviewState === 'blocked' 
                      ? 'Waiting on Parent' 
                      : reviewState === 'review' 
                        ? 'Needs Review' 
                        : reviewState === 'ready' 
                          ? 'Ready for Decision' 
                          : 'Finalized';

                  const actionBadgeClass = 
                    reviewState === 'blocked' 
                      ? 'bg-rose-50 text-rose-700 border-rose-200/50' 
                      : reviewState === 'review' 
                        ? 'bg-amber-50 text-amber-800 border-amber-200/50' 
                        : reviewState === 'ready' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200/50' 
                          : 'bg-slate-50 text-slate-700 border-slate-200/50';

                  return (
                    <tr 
                      key={app.id} 
                      onClick={() => setSelectedAppId(app.id)}
                      className={`border-l-4 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-l-emerald-800 bg-emerald-50/20 shadow-inner' 
                          : `border-l-transparent ${laneMeta.rowClass}`
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-slate-800">
                        <div className="flex items-center gap-2.5">
                          <span className={`inline-flex h-2 w-2 rounded-full ${laneMeta.barClass}`} />
                          {app.ref}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{app.learnerName}</td>
                      <td className="px-6 py-4 text-slate-600">{app.parentName}</td>
                      <td className="px-6 py-4 text-slate-600">{app.grade}</td>
                      <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <span className={`inline-flex rounded-md border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] ${actionBadgeClass}`}>
                            {actionLabel}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className={`inline-flex h-1.5 w-16 overflow-hidden rounded-full ${laneMeta.progressClass}`}>
                              <span
                                className={`h-full rounded-full ${laneMeta.barClass}`}
                                style={{
                                  width: `${Math.max(
                                    12,
                                    Math.round(
                                      ((counts.ready + counts.reviewOnly) / Math.max(counts.total, 1)) * 100,
                                    ),
                                  )}%`,
                                }}
                              />
                            </span>
                            <span>
                              {counts.blocking > 0
                                ? `${counts.blocking} blocking`
                                : counts.reviewOnly > 0
                                  ? `${counts.reviewOnly} flagged`
                                  : `${counts.ready} ready`}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{app.assignedTo}</td>
                      <td className="px-6 py-4 text-slate-600">{app.submittedAt}</td>
                      <td className="px-6 py-4 text-slate-500">{app.updatedAt}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Avoid double toggle
                            setSelectedAppId(app.id);
                          }}
                          className={`inline-flex rounded-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition-colors ${
                            lane === 'blocking' 
                              ? 'bg-rose-700 hover:bg-rose-800' 
                              : lane === 'review' 
                                ? 'bg-amber-700 hover:bg-amber-800' 
                                : lane === 'ready' 
                                  ? 'bg-emerald-800 hover:bg-emerald-900' 
                                  : 'bg-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SurfaceCard>

        {/* Dynamic Sidebar Detail Review Deck */}
        <SurfaceCard className="flex flex-col justify-between border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
          <div>
            <div className="mb-5 pb-4 border-b border-slate-200/60">
              <span className="text-[9px] uppercase font-semibold tracking-[0.14em] text-slate-400">Selected Application</span>
              <h2 className="mt-1 text-xl font-semibold tracking-normal text-slate-950">{featured.learnerName}</h2>
              <p className="text-xs text-slate-600 mt-1">
                {featured.parentName} · {featured.grade}
              </p>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3">
              <div className={`rounded-lg border p-3.5 shadow-sm ${adminLaneMeta[featuredLane].cardClass}`}>
                <div className="text-[9px] uppercase font-semibold tracking-[0.1em] text-slate-500">Completion</div>
                <div className="mt-1 text-2xl font-semibold text-slate-950">{featured.completion}%</div>
              </div>
              <div className="rounded-lg border border-slate-200/80 bg-slate-50 p-3.5 shadow-sm">
                <div className="text-[9px] uppercase font-semibold tracking-[0.1em] text-slate-500">Assigned To</div>
                <div className="text-xs font-semibold mt-2.5 text-slate-900 leading-none">{featured.assignedTo}</div>
              </div>
            </div>

            {/* Stuck-State Micro status Chip inside Detail Card */}
            <div className={`mb-5 rounded-lg border p-4 shadow-sm ${adminLaneMeta[featuredLane].cardClass}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[9px] uppercase font-semibold tracking-[0.12em] text-slate-500">Action State</div>
                  <div className="mt-1">
                    <span className={`inline-flex rounded-md border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] ${
                      featuredReviewState === 'blocked' 
                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                        : featuredReviewState === 'review' 
                          ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : featuredReviewState === 'ready' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      {featuredActionLabel}
                    </span>
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-500">
                  <div>{featuredCounts.ready} ready</div>
                  <div>{featuredCounts.reviewOnly} flagged</div>
                  <div>{featuredCounts.blocking} blocking</div>
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-700">{getPreviewNextAction(featured)}</p>
            </div>

            {/* Documents checklist */}
            <div className="mb-5 space-y-2">
              <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">Uploaded Files Check</span>
              {featured.documents.map((document) => (
                <div
                  key={`${document.type}-${document.uploadedAt ?? 'missing'}`}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${document.status === 'missing' || document.status === 'needs_reupload' ? 'border-rose-200/60 bg-rose-50/40' : document.status === 'manual_review' || document.status === 'low_confidence_ocr' || document.status === 'blurry' ? 'border-amber-200/60 bg-amber-50/40' : 'border-emerald-200/60 bg-emerald-50/30'}`}
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-800 leading-normal">{getPreviewDocumentLabel(document.type)}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{document.uploadedAt ?? 'Not uploaded'}</div>
                  </div>
                  <span className={`text-[10px] font-bold ${document.status === 'missing' || document.status === 'needs_reupload' ? 'text-rose-700' : document.status === 'manual_review' || document.status === 'low_confidence_ocr' || document.status === 'blurry' ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {getPreviewDocumentStatusLabel(document.status)}
                  </span>
                </div>
              ))}
            </div>

            {/* Note block */}
            <div className={`mb-5 rounded-lg border p-3.5 ${featuredReviewState === 'blocked' ? 'border-rose-200/60 bg-rose-50/40' : featuredReviewState === 'review' ? 'border-amber-200/60 bg-amber-50/40' : 'border-emerald-200/60 bg-emerald-50/30'}`}>
              <div className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">Latest Internal Note</div>
              <p className="mt-1.5 text-xs leading-5 text-slate-700">{featured.note}</p>
            </div>
          </div>

          <div>
            <div className="mb-3 text-xs font-bold text-slate-900 border-t border-slate-200/60 pt-4">Action Timeline</div>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {featured.timeline.map((entry) => (
                <div key={`${entry.at}-${entry.title}`} className="rounded-lg border border-slate-200/60 bg-slate-50 px-3.5 py-2.5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-bold text-slate-950">{entry.title}</div>
                    <div className="text-[9px] text-slate-400">{entry.at}</div>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-600 leading-normal">{entry.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>
      </div>
    </PreviewShell>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'emerald' | 'amber' | 'slate';
}) {
  const toneClasses: Record<'emerald' | 'amber' | 'slate', string> = {
    emerald: 'bg-emerald-950 text-white border-white/10 shadow-md shadow-emerald-950/20',
    amber: 'bg-amber-600 text-white border-white/10 shadow-md shadow-amber-900/20',
    slate: 'bg-slate-900 text-white border-white/10 shadow-md shadow-slate-900/20',
  };

  return (
    <SurfaceCard className={`rounded-lg border p-5 ${toneClasses[tone]}`}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/75">{label}</div>
      <div className="mt-3 text-2xl font-semibold leading-none text-white">{value}</div>
    </SurfaceCard>
  );
}
