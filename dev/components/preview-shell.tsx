import Link from 'next/link';
import React from 'react';
import { previewSurfaceSchema, type PreviewSurface } from '@/lib/preview-ui-schema';

type PreviewShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  surface?: PreviewSurface;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
  meta?: React.ReactNode;
};

export function PreviewShell({
  eyebrow,
  title,
  description,
  surface = 'hub',
  backHref = '/dev',
  backLabel = 'Back to preview hub',
  children,
  meta,
}: PreviewShellProps) {
  const surfaceInfo = previewSurfaceSchema[surface];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(31,109,58,0.22),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(184,137,7,0.16),_transparent_25%),linear-gradient(180deg,_#f3f7ee_0%,_#f6f1e2_46%,_#f9f6ed_100%)] text-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[linear-gradient(90deg,rgba(31,109,58,0.06)_1px,transparent_1px),linear-gradient(rgba(31,109,58,0.06)_1px,transparent_1px)] bg-[size:56px_56px] opacity-65"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8 overflow-hidden rounded-[36px] border border-primary-200/70 bg-[linear-gradient(120deg,rgba(11,64,36,0.94),rgba(18,72,40,0.92)_34%,rgba(179,132,15,0.88)_100%)] px-6 py-6 shadow-[0_32px_80px_rgba(11,20,12,0.30)] lg:px-8 lg:py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/20 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/40 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Eunice Admissions
              </span>
              <span className="rounded-full border border-white/40 bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                {surfaceInfo.accent}
              </span>
            </div>
            <div className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-medium text-white">
              Live dev preview
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="type-label text-white/80">{eyebrow}</p>
                <h1 className="display-serif type-display-xl max-w-4xl text-white">
                  {title}
                </h1>
                <p className="type-body max-w-3xl text-white/90">{description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {surfaceInfo.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-white/35 bg-white/12 px-3 py-1 text-xs font-medium text-white">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-[28px] border border-white/35 bg-white/16 p-5 backdrop-blur-md">
                <div className="type-label text-white/80">Preview frame</div>
                <p className="type-body mt-2 text-white/95">{surfaceInfo.lead}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {meta}
                <Link
                  href={backHref}
                  className="inline-flex items-center justify-center rounded-full border border-white/45 bg-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/22"
                >
                  {backLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
