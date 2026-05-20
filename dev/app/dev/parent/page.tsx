import Link from 'next/link';
import {
  previewApplications,
  previewStatusClasses,
} from '@/lib/dev-preview-data';

export default function DevParentPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-700/80">Dev Preview</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Parent admissions dashboard</h1>
          </div>
          <Link href="/dev" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
            Back to preview hub
          </Link>
        </div>

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Welcome back, Lerato</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            This preview shows the kind of calm, clear status tracking we want parents to have instead of relying on
            phone calls and manual follow-up.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {previewApplications.slice(0, 3).map((app) => (
            <div key={app.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">{app.ref}</div>
                  <h3 className="mt-1 text-lg font-semibold">{app.learnerName}</h3>
                  <p className="text-sm text-slate-600">{app.grade}</p>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${previewStatusClasses[app.status]}`}>
                  {app.status.replace('_', ' ')}
                </span>
              </div>
              <div className="mt-5 text-sm text-slate-600">
                <div>Submitted: {app.submittedAt}</div>
                <div>Last updated: {app.updatedAt}</div>
              </div>
              <div className="mt-5">
                <Link
                  href={`/dev/application/${app.id}`}
                  className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                >
                  View application
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
