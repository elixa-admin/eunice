'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PreviewShell } from '@/components/preview-shell';
import { SectionHeading } from '@/components/section-heading';
import { SurfaceCard } from '@/components/surface-card';
import { StatusBadge } from '@/components/status-badge';
import {
  getAdminQueueLane,
  getPreviewDocumentCounts,
  getPreviewDocumentLabel,
  getPreviewDocumentStatusLabel,
  getPreviewNextAction,
  getPreviewReviewState,
  previewApplications,
  previewDocumentClasses,
} from '@/lib/dev-preview-data';

const laneMeta = {
  blocking: {
    label: 'Blocking',
    helper: 'Missing or hard-stop documents',
    card: 'border-rose-200 bg-rose-50/80 text-rose-950',
    chip: 'border-rose-200 bg-white text-rose-700',
    row: 'border-l-rose-300 bg-rose-50/20 hover:bg-rose-50/50',
    bar: 'bg-rose-500',
  },
  review: {
    label: 'Needs review',
    helper: 'Waiting on a staff decision',
    card: 'border-amber-200 bg-amber-50/80 text-amber-950',
    chip: 'border-amber-200 bg-white text-amber-700',
    row: 'border-l-amber-300 bg-amber-50/20 hover:bg-amber-50/50',
    bar: 'bg-amber-500',
  },
  ready: {
    label: 'Ready',
    helper: 'Clear for the next step',
    card: 'border-emerald-200 bg-emerald-50/80 text-emerald-950',
    chip: 'border-emerald-200 bg-white text-emerald-700',
    row: 'border-l-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/50',
    bar: 'bg-emerald-500',
  },
  decision: {
    label: 'Decision',
    helper: 'Accepted or rejected outcomes',
    card: 'border-slate-200 bg-slate-50/80 text-slate-950',
    chip: 'border-slate-200 bg-white text-slate-600',
    row: 'border-l-slate-300 bg-slate-50/20 hover:bg-slate-50/50',
    bar: 'bg-slate-500',
  },
} satisfies Record<'blocking' | 'review' | 'ready' | 'decision', { label: string; helper: string; card: string; chip: string; row: string; bar: string }>;

export default function DevAdminPage() {
  const [selectedAppId, setSelectedAppId] = useState(previewApplications[0].id);
  const featured = previewApplications.find((app) => app.id === selectedAppId) ?? previewApplications[0];
  const reviewState = getPreviewReviewState(featured);
  const counts = getPreviewDocumentCounts(featured);
  const lane = getAdminQueueLane(featured);

  const laneCounts = previewApplications.reduce(
    (acc, app) => {
      acc[getAdminQueueLane(app)] += 1;
      return acc;
    },
    { blocking: 0, review: 0, ready: 0, decision: 0 } as Record<'blocking' | 'review' | 'ready' | 'decision', number>,
  );

  return (
    <PreviewShell
      eyebrow="Dev Preview"
      title="Admissions Operations Dashboard"
      description="A premium queue review surface with clearer document health, risk indicators, and next actions."
      surface="admin"
    >
      <div className="grid gap-6 xl:grid-cols-[250px_minmax(0,1.35fr)_360px]">
        <aside className="space-y-4">
          <SurfaceCard className="border border-primary-100/80 bg-white/90 p-4 shadow-[0_18px_42px_rgba(11,20,12,0.06)]">
            <div className="text-xs uppercase tracking-[0.18em] text-primary-800/70">Admissions</div>
            <div className="mt-2 text-lg font-semibold text-slate-950">Queue Review</div>
            <div className="mt-1 text-sm text-slate-600">Naledi Mokoena is selected for detailed review.</div>
          </SurfaceCard>

          <SurfaceCard className="border border-slate-100 bg-white/90 p-4">
            <div className="space-y-2 text-sm">
              {['Dashboard', 'Queue Review', 'Applications', 'Document Triage', 'Reports'].map((label, index) => (
                <div
                  key={label}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 ${index === 1 ? 'bg-primary-50 text-primary-900' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>{label}</span>
                  {label === 'Queue Review' ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">2</span> : null}
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="border border-slate-100 bg-white/90 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Messages</div>
            <div className="mt-2 text-sm text-slate-600">1 unread</div>
          </SurfaceCard>
        </aside>

        <main className="space-y-6">
          <SurfaceCard className="overflow-hidden border border-primary-200/70 bg-[linear-gradient(135deg,rgba(8,41,27,0.98),rgba(17,57,37,0.96)_48%,rgba(174,127,6,0.92)_100%)] p-0 text-white shadow-[0_26px_70px_rgba(11,20,12,0.18)]">
            <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="h-16 w-16 rounded-full border border-white/20 bg-white/95" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/70">Selected application</div>
                    <h2 className="mt-1 text-3xl font-semibold text-white">{featured.learnerName}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/85">
                      <span>{featured.ref}</span>
                      <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold">{reviewState === 'blocked' ? 'Under review' : reviewState === 'review' ? 'Needs review' : reviewState === 'ready' ? 'Ready' : 'Complete'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <MetricCard label="Assigned reviewer" value={featured.assignedTo} />
                  <MetricCard label="Grade applying for" value={featured.grade} />
                  <MetricCard label="Application submitted" value={featured.submittedAt} />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[24px] border border-white/12 bg-white/12 p-4 backdrop-blur-md">
                  <div className="text-xs uppercase tracking-[0.16em] text-white/70">Queue health</div>
                  <div className="mt-3 grid gap-2">
                    {(['blocking', 'review', 'ready', 'decision'] as const).map((key) => (
                      <div key={key} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-sm text-white">
                        <span>{laneMeta[key].label}</span>
                        <span className="font-semibold">{laneCounts[key]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/12 bg-white/12 p-4 backdrop-blur-md">
                  <div className="text-xs uppercase tracking-[0.16em] text-white/70">Next action</div>
                  <p className="mt-2 text-sm leading-6 text-white/90">{getPreviewNextAction(featured)}</p>
                </div>
              </div>
            </div>
          </SurfaceCard>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)]">
            <SurfaceCard className="overflow-hidden border border-slate-100 bg-white/92 p-0 shadow-[0_18px_40px_rgba(11,20,12,0.06)]">
              <div className="border-b border-slate-100 bg-[#faf7ef] px-6 py-5">
                <SectionHeading title="Admissions Queue" description="Click any row to load the record into the review panel." />
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-900 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                    <tr>
                      <th className="px-6 py-4">Reference</th>
                      <th className="px-6 py-4">Learner</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Docs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {previewApplications.map((app) => {
                      const appLane = getAdminQueueLane(app);
                      const isSelected = app.id === selectedAppId;
                      const appCounts = getPreviewDocumentCounts(app);
                      return (
                        <tr
                          key={app.id}
                          onClick={() => setSelectedAppId(app.id)}
                          className={`cursor-pointer border-l-4 transition ${isSelected ? 'border-l-primary-800 bg-primary-50/30' : laneMeta[appLane].row}`}
                        >
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-950">{app.ref}</div>
                            <div className="text-xs text-slate-500">{app.assignedTo}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-950">{app.learnerName}</div>
                            <div className="text-xs text-slate-500">{app.parentName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${laneMeta[appLane].chip}`}>{appCounts.blocking} block</span>
                              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600">{appCounts.reviewOnly} review</span>
                              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">{appCounts.ready} ready</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </SurfaceCard>

            <div className="space-y-6">
              <SurfaceCard className="border border-slate-100 bg-white/92 p-5">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Risk indicators</div>
                <div className="mt-4 space-y-3 text-sm">
                  <RiskRow label="Incomplete documents" value={counts.blocking} tone="rose" />
                  <RiskRow label="Document issues" value={counts.reviewOnly} tone="amber" />
                  <RiskRow label="Ready for decision" value={counts.ready} tone="emerald" />
                </div>
              </SurfaceCard>

              <SurfaceCard className="border border-slate-100 bg-white/92 p-5">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Document checklist</div>
                <div className="mt-4 space-y-3">
                  {featured.documents.map((document) => (
                    <div key={`${document.type}-${document.uploadedAt ?? 'missing'}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-[#fbf8f0] px-4 py-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-950">{getPreviewDocumentLabel(document.type)}</div>
                        <div className="text-xs text-slate-500">{document.note ?? 'No note yet.'}</div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${previewDocumentClasses[document.status]}`}>
                          {getPreviewDocumentStatusLabel(document.status)}
                        </span>
                        <div className="mt-1 text-[11px] text-slate-500">{document.uploadedAt ?? 'Not uploaded'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </SurfaceCard>

              <SurfaceCard className="border border-amber-200 bg-amber-50/80 p-5">
                <div className="text-xs uppercase tracking-[0.16em] text-amber-800">Recommended next action</div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{getPreviewNextAction(featured)}</p>
                <div className="mt-4 flex gap-3">
                  <Link href={`/dev/application/${featured.id}`} className="inline-flex items-center rounded-xl bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white">
                    Open record
                  </Link>
                </div>
              </SurfaceCard>
            </div>
          </div>
        </main>
      </div>
    </PreviewShell>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/12 bg-white/12 p-4 backdrop-blur-md">
      <div className="text-xs uppercase tracking-[0.16em] text-white/70">{label}</div>
      <div className="mt-2 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function RiskRow({ label, value, tone }: { label: string; value: number; tone: 'rose' | 'amber' | 'emerald' }) {
  const toneClass =
    tone === 'rose'
      ? 'bg-rose-100 text-rose-700'
      : tone === 'amber'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-emerald-100 text-emerald-700';

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-[#fbf8f0] px-4 py-3">
      <div className="text-sm text-slate-700">{label}</div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass}`}>{value}</span>
    </div>
  );
}
