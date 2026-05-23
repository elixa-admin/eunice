import Link from 'next/link';

export default function DevAdminPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_right,_rgba(15,23,42,0.18),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(22,163,74,0.08),_transparent_24%)] px-4 py-12">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200/80 bg-white/96 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.12)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Admin Demo</p>
        <h1 className="display-serif mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Admin dashboard preview is active
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          This route bypasses authentication so reviewers can always open admin preview links. Use this as the default entry for demos and QA checks.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dev" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
            Back to Dev Hub
          </Link>
          <Link href="/dev/application/sample" className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100">
            Open Sample Application
          </Link>
          <Link href="/admin" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Open Live Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
