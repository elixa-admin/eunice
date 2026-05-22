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

const featured = previewApplications[0];
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
const adminLaneMeta = {
  blocking: {
    label: 'Blocking',
    helper: 'Missing documents or hard stops',
    cardClass: 'border-rose-200 bg-rose-50/80 text-rose-950 shadow-[0_16px_36px_rgba(225,29,72,0.08)]',
    chipClass: 'border-rose-200 bg-white text-rose-700',
    rowClass: 'border-l-rose-300 bg-rose-50/35 hover:bg-rose-50/65',
    barClass: 'bg-rose-500',
    progressClass: 'bg-rose-100',
  },
  review: {
    label: 'Needs review',
    helper: 'Waiting on a staff decision',
    cardClass: 'border-amber-200 bg-amber-50/80 text-amber-950 shadow-[0_16px_36px_rgba(217,119,6,0.08)]',
    chipClass: 'border-amber-200 bg-white text-amber-700',
    rowClass: 'border-l-amber-300 bg-amber-50/30 hover:bg-amber-50/60',
    barClass: 'bg-amber-500',
    progressClass: 'bg-amber-100',
  },
  ready: {
    label: 'Ready',
    helper: 'Clear for the next step',
    cardClass: 'border-emerald-200 bg-emerald-50/80 text-emerald-950 shadow-[0_16px_36px_rgba(16,185,129,0.08)]',
    chipClass: 'border-emerald-200 bg-white text-emerald-700',
    rowClass: 'border-l-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/60',
    barClass: 'bg-emerald-500',
    progressClass: 'bg-emerald-100',
  },
  decision: {
    label: 'Decision',
    helper: 'Accepted or rejected outcomes',
    cardClass: 'border-slate-200 bg-slate-50/80 text-slate-950 shadow-[0_16px_36px_rgba(71,85,105,0.08)]',
    chipClass: 'border-slate-200 bg-white text-slate-600',
    rowClass: 'border-l-slate-300 bg-slate-50/30 hover:bg-slate-50/60',
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
const laneTotal = totals.total || 1;

export default function DevAdminPage() {
  return (
    <PreviewShell
      eyebrow="Dev Preview"
      title="Admissions Operations Dashboard"
      description="A polished operations surface for admissions staff, with better hierarchy and a more deliberate review feel."
      surface="admin"
    >
      <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,#0d321c,#124828_38%,#9a730f)] p-7 text-white">
          <p className="type-label text-white/80">Operations at a glance</p>
          <h2 className="display-serif type-display-lg mt-3 text-white">Admissions queue with stronger visual hierarchy</h2>
          <p className="type-body mt-3 max-w-2xl text-white/90">
            This surface should feel like a real operations cockpit, with immediate clarity on risk, volume, and next decisions.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatCard label="Total Applications" value={totals.total.toString()} tone="emerald" />
            <StatCard label="Needs Review" value={laneCounts.review.toString()} tone="amber" />
            <StatCard label="Blocking Cases" value={laneCounts.blocking.toString()} tone="slate" />
          </div>
        </SurfaceCard>

        <SurfaceCard className="bg-[linear-gradient(180deg,#fffef9,#f7f2e3)] p-7">
          <p className="type-label text-primary-700/75">Queue health</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-primary-200 bg-white px-4 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
              <div className="type-label text-slate-500">Decision queue</div>
              <div className="type-metric mt-2 text-slate-950">{laneCounts.decision}</div>
            </div>
            <div className="rounded-2xl border border-accent-200 bg-[linear-gradient(145deg,#fef8e7,#f7e2a0)] px-4 py-3 shadow-[0_12px_28px_rgba(184,137,7,0.18)]">
              <div className="type-label text-accent-700">Dev only</div>
              <div className="type-body mt-2 font-semibold text-slate-950">
                Queue lanes are now derived from workflow logic, not static status labels.
              </div>
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {(Object.keys(adminLaneMeta) as Array<keyof typeof adminLaneMeta>).map((lane) => {
          const meta = adminLaneMeta[lane];
          const count = laneCounts[lane];
          const progress = Math.max(4, Math.round((count / laneTotal) * 100));

          return (
            <SurfaceCard key={lane} className={`overflow-hidden border p-0 ${meta.cardClass}`}>
              <div className="h-1.5 bg-white/60">
                <div className={`h-full ${meta.barClass}`} style={{ width: `${progress}%` }} />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="type-label text-current/60">{meta.label}</p>
                    <h3 className="type-title mt-2 text-current">{count}</h3>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${meta.chipClass}`}>
                    {progress}%
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-current/75">{meta.helper}</p>
                <div className={`mt-4 h-2 w-full overflow-hidden rounded-full ${meta.progressClass}`}>
                  <div className={`h-full rounded-full ${meta.barClass}`} style={{ width: `${progress}%` }} />
                </div>
              </div>
            </SurfaceCard>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
        <SurfaceCard className="overflow-hidden border-primary-200 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
          <div className="border-b border-primary-100 bg-[linear-gradient(180deg,#f4f9f2,#edf5ea)] px-6 py-5">
            <SectionHeading
              title="Application queue"
              description="Preview records modeled on the current admissions workflow."
              action={(
                <div className="rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700">Dev only</div>
              )}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="type-label bg-primary-900 text-white/80">
                <tr>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Learner</th>
                  <th className="px-6 py-4">Parent</th>
                  <th className="px-6 py-4">Grade</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Document health</th>
                  <th className="px-6 py-4">Assigned</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Updated</th>
                  <th className="px-6 py-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100 bg-white">
                {previewApplications.map((app) => {
                  const lane = getAdminQueueLane(app);
                  const laneMeta = adminLaneMeta[lane];
                  const reviewState = getPreviewReviewState(app);
                  const counts = getPreviewDocumentCounts(app);

                  return (
                    <tr key={app.id} className={`border-l-4 border-transparent transition ${laneMeta.rowClass}`}>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex h-2.5 w-2.5 rounded-full ${laneMeta.barClass}`} />
                          {app.ref}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-950">{app.learnerName}</td>
                      <td className="px-6 py-4 text-slate-600">{app.parentName}</td>
                      <td className="px-6 py-4 text-slate-600">{app.grade}</td>
                      <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${PREVIEW_REVIEW_STATE_CLASSES[reviewState]}`}>
                            {PREVIEW_REVIEW_STATE_LABELS[reviewState]}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
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
                            {counts.blocking > 0
                              ? `${counts.blocking} blocking`
                              : counts.reviewOnly > 0
                                ? `${counts.reviewOnly} flagged`
                                : `${counts.ready} ready`}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{app.assignedTo}</td>
                      <td className="px-6 py-4 text-slate-600">{app.submittedAt}</td>
                      <td className="px-6 py-4 text-slate-500">{app.updatedAt}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dev/application/${app.id}`}
                          className={`inline-flex rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(13,50,28,0.22)] transition ${lane === 'blocking' ? 'bg-rose-700 hover:bg-rose-600' : lane === 'review' ? 'bg-amber-700 hover:bg-amber-600' : lane === 'ready' ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                          Review file
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SurfaceCard>

        <SurfaceCard className="bg-[linear-gradient(180deg,#fffef9,#f6f0df)] p-6">
          <div className="mb-5">
            <p className="type-label text-slate-400">Selected application</p>
            <h2 className="display-serif type-title mt-2 text-slate-950">{featured.learnerName}</h2>
            <p className="type-body text-slate-600">
              {featured.parentName} · {featured.grade}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className={`rounded-2xl border p-4 shadow-sm ${adminLaneMeta[featuredLane].cardClass}`}>
              <div className="type-label text-slate-500">Completion</div>
              <div className="type-metric mt-2 text-slate-950">{featured.completion}%</div>
            </div>
            <div className="rounded-2xl border border-primary-200 bg-white p-4 shadow-sm">
              <div className="type-label text-slate-500">Assigned</div>
              <div className="type-body mt-2 font-semibold text-slate-950">{featured.assignedTo}</div>
            </div>
          </div>

          <div className={`mb-6 rounded-2xl border p-4 shadow-[0_12px_30px_rgba(22,163,74,0.06)] ${adminLaneMeta[featuredLane].cardClass}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Review state</div>
                <div className="mt-2">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${PREVIEW_REVIEW_STATE_CLASSES[featuredReviewState]}`}>
                    {PREVIEW_REVIEW_STATE_LABELS[featuredReviewState]}
                  </span>
                </div>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div>{featuredCounts.ready} ready</div>
                <div>{featuredCounts.reviewOnly} flagged</div>
                <div>{featuredCounts.blocking} blocking</div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{getPreviewNextAction(featured)}</p>
          </div>

          <div className="mb-6 space-y-3">
            {featured.documents.map((document) => (
              <div
                key={`${document.type}-${document.uploadedAt ?? 'missing'}`}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${document.status === 'missing' || document.status === 'needs_reupload' ? 'border-rose-200 bg-rose-50/60' : document.status === 'manual_review' || document.status === 'low_confidence_ocr' || document.status === 'blurry' ? 'border-amber-200 bg-amber-50/60' : 'border-emerald-200 bg-emerald-50/50'}`}
              >
                <div>
                  <div className="text-sm text-slate-700">{getPreviewDocumentLabel(document.type)}</div>
                  <div className="text-xs text-slate-500">{document.uploadedAt ?? 'Not uploaded yet'}</div>
                </div>
                <span className={`text-xs font-medium ${document.status === 'missing' || document.status === 'needs_reupload' ? 'text-rose-700' : document.status === 'manual_review' || document.status === 'low_confidence_ocr' || document.status === 'blurry' ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {getPreviewDocumentStatusLabel(document.status)}
                </span>
              </div>
            ))}
          </div>

          <div className={`mb-6 rounded-2xl border p-4 ${featuredReviewState === 'blocked' ? 'border-rose-200 bg-rose-50/60' : featuredReviewState === 'review' ? 'border-amber-200 bg-amber-50/60' : 'border-emerald-200 bg-emerald-50/60'}`}>
            <div className="text-xs uppercase tracking-[0.16em] text-primary-700/80">Admin note</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">{featured.note}</p>
          </div>

          <div>
            <div className="mb-3 text-sm font-semibold text-slate-950">Timeline</div>
            <div className="space-y-3">
              {featured.timeline.map((entry) => (
                <div key={`${entry.at}-${entry.title}`} className="rounded-2xl border border-primary-100 bg-white/80 px-4 py-3 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-950">{entry.title}</div>
                    <div className="text-xs text-slate-500">{entry.at}</div>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{entry.detail}</div>
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
    emerald: 'bg-[linear-gradient(160deg,#1f6d3a,#144d2b)] text-white border-white/20 shadow-[0_14px_28px_rgba(9,48,27,0.35)]',
    amber: 'bg-[linear-gradient(160deg,#c08a08,#8f6906)] text-white border-white/20 shadow-[0_14px_28px_rgba(143,105,6,0.35)]',
    slate: 'bg-[linear-gradient(160deg,#2f3a4b,#1f2838)] text-white border-white/20 shadow-[0_14px_28px_rgba(31,40,56,0.35)]',
  };

  return (
    <SurfaceCard className={`border p-5 ${toneClasses[tone]}`}>
      <div className="text-xs uppercase tracking-[0.16em] text-white/75">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
    </SurfaceCard>
  );
}
