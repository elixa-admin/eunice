import Link from 'next/link';

export default function DevAdminEntryPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top,_rgba(22,163,74,0.1),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(202,138,4,0.08),_transparent_30%)] px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200/80 bg-white/95 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.12)] sm:p-10">
        <div className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-900">
          Dev Admin Entry
        </div>
        <h1 className="display-serif mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Open the admin workspace
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          This route exists as a lightweight entry point into the admin surface. Use the main admin dashboard for review work, or jump back to the preview hub.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin"
            className="rounded-2xl border border-slate-900 bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open Admin Dashboard
          </Link>
          <Link
            href="/dev"
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-950 transition hover:border-emerald-300 hover:bg-emerald-100"
          >
            Return to Preview Hub
          </Link>
        </div>
      </div>
    </main>
  );
}
