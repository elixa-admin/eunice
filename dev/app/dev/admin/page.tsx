import Link from 'next/link';
import {
  previewApplications,
  previewStatusClasses,
} from '@/lib/dev-preview-data';

const totals = {
  total: previewApplications.length,
  pending: previewApplications.filter((app) => app.status === 'submitted' || app.status === 'under_review').length,
  incomplete: previewApplications.filter((app) => app.status === 'incomplete').length,
  accepted: previewApplications.filter((app) => app.status === 'accepted').length,
};

const featured = previewApplications[0];

export default function DevAdminPage() {
  return (
    <div className="min-h-screen bg-[#08111f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-200/80">Dev Preview</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Admissions Operations Dashboard</h1>
          </div>
          <Link href="/dev" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            Back to preview hub
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <StatCard label="Total Applications" value={totals.total.toString()} />
          <StatCard label="Pending Review" value={totals.pending.toString()} />
          <StatCard label="Incomplete" value={totals.incomplete.toString()} />
          <StatCard label="Accepted" value={totals.accepted.toString()} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold">Application queue</h2>
                <p className="text-sm text-slate-300">Preview records modeled on the current admissions workflow.</p>
              </div>
              <div className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-100">Dev only</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-[0.16em] text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Reference</th>
                    <th className="px-6 py-4">Learner</th>
                    <th className="px-6 py-4">Parent</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Submitted</th>
                    <th className="px-6 py-4">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {previewApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 font-medium text-slate-200">{app.ref}</td>
                      <td className="px-6 py-4 text-white">{app.learnerName}</td>
                      <td className="px-6 py-4 text-slate-300">{app.parentName}</td>
                      <td className="px-6 py-4 text-slate-300">{app.grade}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${previewStatusClasses[app.status]}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{app.submittedAt}</td>
                      <td className="px-6 py-4 text-slate-400">{app.updatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Selected application</p>
              <h2 className="mt-2 text-xl font-semibold">{featured.learnerName}</h2>
              <p className="text-sm text-slate-300">{featured.parentName} · {featured.grade}</p>
            </div>

            <div className="mb-6 space-y-3">
              {featured.documents.map((document) => (
                <div key={document.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                  <span className="text-sm text-slate-200">{document.label}</span>
                  <span className="text-xs font-medium capitalize text-slate-300">{document.status}</span>
                </div>
              ))}
            </div>

            <div className="mb-6 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-blue-200/80">Admin note</div>
              <p className="mt-2 text-sm leading-6 text-slate-200">{featured.note}</p>
            </div>

            <div>
              <div className="mb-3 text-sm font-semibold text-white">Timeline</div>
              <div className="space-y-3">
                {featured.timeline.map((entry) => (
                  <div key={entry} className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-300">
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
    </div>
  );
}
