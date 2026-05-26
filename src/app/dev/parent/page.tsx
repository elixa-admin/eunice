import Link from 'next/link';

export default function DevParentPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.11),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(202,138,4,0.08),_transparent_28%)] px-4 py-12">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-emerald-100/80 bg-white/95 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.1)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-900">Parent Demo</p>
        <h1 className="display-serif mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Parent portal preview is active
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          This demo route is intentionally auth-free so preview links always work. Use it for flow walkthroughs and stakeholder review when account setup is not available.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dev" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
            Back to Dev Hub
          </Link>
          <Link href="/parent" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Open Live Parent Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
