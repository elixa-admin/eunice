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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(31,109,58,0.10),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(184,137,7,0.08),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(31,109,58,0.05),_transparent_24%),linear-gradient(180deg,_#fbfbf6_0%,_#f7f4ea_42%,_#faf8f2_100%)] text-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[linear-gradient(90deg,rgba(31,109,58,0.045)_1px,transparent_1px),linear-gradient(rgba(31,109,58,0.045)_1px,transparent_1px)] bg-[size:46px_46px] opacity-70"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8 overflow-hidden rounded-[36px] border border-primary-100/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(249,247,239,0.96))] px-6 py-6 shadow-[0_26px_60px_rgba(15,23,42,0.07)] lg:px-8 lg:py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-primary-100/70 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
                Eunice Admissions
              </span>
              <span className="rounded-full border border-accent-100 bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-700">
                {surfaceInfo.accent}
              </span>
            </div>
            <div className="rounded-full border border-primary-100 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              Live dev preview
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary-700/75">{eyebrow}</p>
                <h1 className="display-serif max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.85rem] lg:leading-[1.05]">
                  {title}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {surfaceInfo.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-primary-100 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-[28px] border border-primary-100 bg-white/95 p-5 shadow-[0_18px_45px_rgba(31,109,58,0.08)]">
                <div className="text-xs uppercase tracking-[0.18em] text-primary-700/70">Preview frame</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{surfaceInfo.lead}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {meta}
                <Link
                  href={backHref}
                  className="inline-flex items-center justify-center rounded-full border border-primary-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-primary-200 hover:bg-primary-50"
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
