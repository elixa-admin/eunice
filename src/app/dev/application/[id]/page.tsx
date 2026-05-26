import Link from 'next/link';

type DevApplicationDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DevApplicationDetailPage({ params }: DevApplicationDetailPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(22,163,74,0.09),_transparent_26%)] px-4 py-12">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200/80 bg-white/96 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.12)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Application Demo</p>
        <h1 className="display-serif mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Preview application: {id}
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          This is an auth-free preview route for application deep links shared during testing and stakeholder walkthroughs.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dev/admin" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
            Back to Admin Demo
          </Link>
          <Link href="/admin" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Open Live Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
