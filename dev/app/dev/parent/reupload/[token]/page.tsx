import Link from 'next/link';
import { PreviewShell } from '@/components/preview-shell';
import { SurfaceCard } from '@/components/surface-card';

type ReuploadPageProps = {
  params: Promise<{ token: string }>;
};

export default async function DevParentReuploadPage({ params }: ReuploadPageProps) {
  const { token } = await params;

  return (
    <PreviewShell
      eyebrow="Parent Preview"
      title="Secure re-upload"
      description="A focused landing page for one document replacement request."
      surface="parent"
      backHref="/dev/parent"
      backLabel="Back to parent"
    >
      <div className="mx-auto max-w-3xl">
        <SurfaceCard className="border border-primary-100/80 bg-white/92 p-6 shadow-[0_24px_60px_rgba(11,20,12,0.08)]">
          <div className="text-xs uppercase tracking-[0.2em] text-primary-800/70">Magic-link scaffold</div>
          <h1 className="display-serif mt-3 text-3xl font-semibold text-slate-950">Upload one document again</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            This route shows the shape of the secure re-upload flow without wiring live token delivery yet. It keeps the parent experience calm and focused on one replacement upload.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-accent-200 bg-[#fffaf0] p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-accent-800">What happens here</div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li>1. Read the document request.</li>
                <li>2. Upload a clearer replacement file.</li>
                <li>3. Return to the parent portal once the upload is saved.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-[#fcfaf5] p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Link reference</div>
              <div className="mt-2 break-all rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                {token || 'No token provided'}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                This is intentionally lightweight. A later sprint can connect a short-lived token and route straight into a single upload slot.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dev/parent" className="inline-flex items-center rounded-full bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white">
              Return to parent preview
            </Link>
            <Link href="/dev" className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">
              Go to preview hub
            </Link>
          </div>
        </SurfaceCard>
      </div>
    </PreviewShell>
  );
}
