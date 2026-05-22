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
      description="Operational admissions queue with status tracking, document review states, and lightweight preview data."
      surface="admin"
    >
      <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(22,163,74,0.08),rgba(202,138,4,0.10))] p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-primary-700/75">Operations at a glance</p>
          <h2 className="display-serif mt-3 text-3xl font-semibold text-slate-950">Admissions queue with stronger visual hierarchy</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            The admin view stays operational, but it should feel polished, confident, and easier to scan in a busy review session.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatCard label="Total Applications" value={totals.total.toString()} />
            <StatCard label="Pending Review" value={totals.pending.toString()} />
            <StatCard label="Incomplete" value={totals.incomplete.toString()} />
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-primary-700/75">Queue health</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Accepted</div>
              <div className="mt-2 text-3xl font-semibold text-slate-950">{totals.accepted}</div>
            </div>
            <div className="rounded-2xl border border-accent-200 bg-accent-50/70 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.16em] text-accent-700">Dev only</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">Review states now use Eunice green and gold accents.</div>
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
        <SurfaceCard className="overflow-hidden shadow-[0_24px_60px_rgba(22,163,74,0.08)]">
          <div className="border-b border-primary-100 px-6 py-5">
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
              <thead className="bg-primary-50/70 text-xs uppercase tracking-[0.16em] text-slate-500">
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
              <tbody className="divide-y divide-primary-100">
                {previewApplications.map((app) => {
                  const reviewState = getPreviewReviewState(app);
                  const counts = getPreviewDocumentCounts(app);

                  return (
                    <tr key={app.id} className="hover:bg-primary-50/60">
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
                          className="inline-flex rounded-xl border border-primary-200 bg-white px-3 py-2 text-xs font-semibold text-primary-900 transition hover:bg-primary-50"
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

        <SurfaceCard className="p-6">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Selected application</p>
            <h2 className="display-serif mt-2 text-2xl font-semibold text-slate-950">{featured.learnerName}</h2>
            <p className="text-sm text-slate-600">
              {featured.parentName} · {featured.grade}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Completion</div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">{featured.completion}%</div>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-4">
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <SurfaceCard className="p-5">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-slate-950">{value}</div>
    </SurfaceCard>
  );
}
