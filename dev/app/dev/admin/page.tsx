import { PreviewShell } from '@/components/preview-shell';
import { SectionHeading } from '@/components/section-heading';
import { StatusBadge } from '@/components/status-badge';
import { SurfaceCard } from '@/components/surface-card';
import { previewApplications } from '@/lib/dev-preview-data';

const totals = {
  total: previewApplications.length,
  pending: previewApplications.filter((app) => app.status === 'submitted' || app.status === 'under_review').length,
  incomplete: previewApplications.filter((app) => app.status === 'incomplete').length,
  accepted: previewApplications.filter((app) => app.status === 'accepted').length,
};

const featured = previewApplications[0];

export default function DevAdminPage() {
  return (
    <PreviewShell
      eyebrow="Dev Preview"
      title="Admissions Operations Dashboard"
      description="Operational admissions queue with status tracking, document review states, and lightweight preview data."
    >
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Total Applications" value={totals.total.toString()} />
        <StatCard label="Pending Review" value={totals.pending.toString()} />
        <StatCard label="Incomplete" value={totals.incomplete.toString()} />
        <StatCard label="Accepted" value={totals.accepted.toString()} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
        <SurfaceCard className="overflow-hidden">
          <div className="border-b border-primary-100 px-6 py-5">
            <SectionHeading
              title="Application queue"
              description="Preview records modeled on the current admissions workflow."
              action={(
                <div className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">Dev only</div>
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
                  <th className="px-6 py-4">Assigned</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {previewApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-primary-50/60">
                    <td className="px-6 py-4 font-medium text-slate-800">{app.ref}</td>
                    <td className="px-6 py-4 text-slate-950">{app.learnerName}</td>
                    <td className="px-6 py-4 text-slate-600">{app.parentName}</td>
                    <td className="px-6 py-4 text-slate-600">{app.grade}</td>
                    <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                    <td className="px-6 py-4 text-slate-600">{app.assignedTo}</td>
                    <td className="px-6 py-4 text-slate-600">{app.submittedAt}</td>
                    <td className="px-6 py-4 text-slate-500">{app.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Selected application</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">{featured.learnerName}</h2>
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

          <div className="mb-6 space-y-3">
            {featured.documents.map((document) => (
              <div
                key={document.label}
                className="flex items-center justify-between rounded-2xl border border-primary-100 bg-primary-50/40 px-4 py-3"
              >
                <div>
                  <div className="text-sm text-slate-700">{document.label}</div>
                  <div className="text-xs text-slate-500">{document.uploadedAt ?? 'Not uploaded yet'}</div>
                </div>
                <span className="text-xs font-medium capitalize text-slate-500">{document.status}</span>
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
