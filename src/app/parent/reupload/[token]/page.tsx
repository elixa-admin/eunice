import Link from 'next/link';
import { notFound } from 'next/navigation';

type ReuploadPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ParentReuploadPage({ params }: ReuploadPageProps) {
  const { token } = await params;

  if (!token) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(26,82,51,0.18),transparent_42%),linear-gradient(180deg,#fbf8ef_0%,#f4efe2_100%)] px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[32px] border border-primary-100 bg-white/90 p-6 shadow-[0_24px_60px_rgba(11,20,12,0.08)] backdrop-blur">
          <div className="text-xs uppercase tracking-[0.2em] text-primary-800/70">Secure re-upload</div>
          <h1 className="display-serif mt-3 text-3xl font-semibold text-slate-950">Upload one document again</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            This link is meant for a single document that admissions asked you to replace. It keeps the upload path calm and focused so you do not need to reopen the whole application.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-accent-200 bg-[#fffaf0] p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-accent-800">What happens here</div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li>1. Choose the requested document.</li>
                <li>2. Upload a clearer replacement file.</li>
                <li>3. Return to the parent portal once the upload is saved.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-[#fcfaf5] p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Link reference</div>
              <div className="mt-2 break-all rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                {token}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                This is a scaffolded route for now. Later, a short-lived magic link can route directly into a single-slot upload experience.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/parent" className="inline-flex items-center rounded-full bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white">
              Return to parent portal
            </Link>
            <Link href="/" className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">
              Go to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
