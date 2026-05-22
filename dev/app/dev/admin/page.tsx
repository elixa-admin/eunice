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
} from '@/lib/dev-preview-data';
import Link from 'next/link';

const totals = {
  total: previewApplications.length,
  pending: previewApplications.filter((app) => app.status === 'submitted' || app.status === 'under_review').length,
  incomplete: previewApplications.filter((app) => app.status === 'incomplete').length,
  accepted: previewApplications.filter((app) => app.status === 'accepted').length,
};

const featured = previewApplications[0];
const featuredReviewState = getPreviewReviewState(featured);
const featuredCounts = getPreviewDocumentCounts(featured);

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
          <p className="text-xs uppercase tracking-[0.18em] text-white/80">Operations at a glance</p>
          <h2 className="display-serif mt-3 text-3xl font-semibold text-white">Admissions queue with stronger visual hierarchy</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/90">
            This surface should feel like a real operations cockpit, with immediate clarity on risk, volume, and next decisions.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatCard label="Total Applications" value={totals.total.toString()} tone="emerald" />
            <StatCard label="Pending Review" value={totals.pending.toString()} tone="amber" />
            <StatCard label="Incomplete" value={totals.incomplete.toString()} tone="slate" />
          </div>
        </SurfaceCard>

        <SurfaceCard className="bg-[linear-gradient(180deg,#fffef9,#f7f2e3)] p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-primary-700/75">Queue health</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-primary-200 bg-white px-4 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Accepted</div>
              <div className="mt-2 text-3xl font-semibold text-slate-950">{totals.accepted}</div>
            </div>
            <div className="rounded-2xl border border-accent-200 bg-[linear-gradient(145deg,#fef8e7,#f7e2a0)] px-4 py-3 shadow-[0_12px_28px_rgba(184,137,7,0.18)]">
              <div className="text-xs uppercase tracking-[0.16em] text-accent-700">Dev only</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">Review states now use Eunice green and gold accents.</div>
            </div>
          </div>
        </SurfaceCard>
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
              <thead className="bg-primary-900 text-xs uppercase tracking-[0.16em] text-white/80">
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
                  const reviewState = getPreviewReviewState(app);
                  const counts = getPreviewDocumentCounts(app);

                  return (
                    <tr key={app.id} className="transition hover:bg-emerald-50/40">
                      <td className="px-6 py-4 font-medium text-slate-800">{app.ref}</td>
                      <td className="px-6 py-4 text-slate-950">{app.learnerName}</td>
                      <td className="px-6 py-4 text-slate-600">{app.parentName}</td>
                      <td className="px-6 py-4 text-slate-600">{app.grade}</td>
                      <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${PREVIEW_REVIEW_STATE_CLASSES[reviewState]}`}>
                            {PREVIEW_REVIEW_STATE_LABELS[reviewState]}
                          </span>
                          <div className="text-xs text-slate-500">
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
                          className="inline-flex rounded-xl bg-primary-900 px-3 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(13,50,28,0.28)] transition hover:bg-primary-700"
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
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Selected application</p>
            <h2 className="display-serif mt-2 text-2xl font-semibold text-slate-950">{featured.learnerName}</h2>
            <p className="text-sm text-slate-600">
              {featured.parentName} · {featured.grade}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-primary-200 bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Completion</div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">{featured.completion}%</div>
            </div>
            <div className="rounded-2xl border border-primary-200 bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Assigned</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{featured.assignedTo}</div>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-primary-100 bg-white p-4 shadow-[0_12px_30px_rgba(22,163,74,0.06)]">
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
                className="flex items-center justify-between rounded-2xl border border-primary-100 bg-primary-50/40 px-4 py-3"
              >
                <div>
                  <div className="text-sm text-slate-700">{getPreviewDocumentLabel(document.type)}</div>
                  <div className="text-xs text-slate-500">{document.uploadedAt ?? 'Not uploaded yet'}</div>
                </div>
                <span className="text-xs font-medium text-slate-500">{getPreviewDocumentStatusLabel(document.status)}</span>
              </div>
            ))}
          </div>

          <div className="mb-6 rounded-2xl border border-primary-100 bg-primary-50 p-4">
            <div className="text-xs uppercase tracking-[0.16em] text-primary-700/80">Admin note</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">{featured.note}</p>
          </div>

          <div>
            <div className="mb-3 text-sm font-semibold text-slate-950">Timeline</div>
            <div className="space-y-3">
              {featured.timeline.map((entry) => (
                <div key={`${entry.at}-${entry.title}`} className="rounded-2xl border border-primary-100 bg-primary-50/40 px-4 py-3">
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
