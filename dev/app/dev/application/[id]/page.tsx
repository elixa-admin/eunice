import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  previewApplications,
  previewDocumentClasses,
  previewStatusClasses,
} from '@/lib/dev-preview-data';

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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-200/80">Application Preview</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{application.learnerName}</h1>
            <p className="mt-1 text-sm text-slate-300">{application.parentName} · {application.ref}</p>
          </div>
          <Link href="/dev/admin" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            Back to admin
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Current status</div>
                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${previewStatusClasses[application.status]}`}>
                  {application.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-sm text-slate-400">Grade: {application.grade}</div>
            </div>

            <h2 className="mb-4 text-lg font-semibold">Document checklist</h2>
            <div className="space-y-3">
              {application.documents.map((document) => (
                <div key={document.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                  <span className="text-sm text-slate-200">{document.label}</span>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${previewDocumentClasses[document.status]}`}>
                    {document.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Review notes</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{application.note}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Activity</h2>
              <div className="mt-4 space-y-3">
                {application.timeline.map((entry) => (
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
