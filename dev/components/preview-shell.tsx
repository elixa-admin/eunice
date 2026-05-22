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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(202,138,4,0.10),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.06),_transparent_26%),linear-gradient(180deg,_#fbfef9_0%,_#f7fbf4_44%,_#f8fafc_100%)] text-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[linear-gradient(90deg,rgba(21,128,61,0.04)_1px,transparent_1px),linear-gradient(rgba(21,128,61,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8 overflow-hidden rounded-[36px] border border-primary-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.97),rgba(248,250,246,0.92))] px-6 py-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] lg:px-8 lg:py-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-800">
                  Eunice Admissions
                </span>
                <span className="rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-800">
                  {surfaceInfo.label}
                </span>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary-700/75">{eyebrow}</p>
                <h1 className="display-serif max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.85rem] lg:leading-[1.05]">
                  {title}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {surfaceInfo.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-primary-100 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-[28px] border border-primary-100 bg-white/90 p-5 shadow-[0_18px_45px_rgba(22,163,74,0.08)]">
                <div className="text-xs uppercase tracking-[0.18em] text-primary-700/70">Preview frame</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{surfaceInfo.lead}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {meta}
                <Link
                  href={backHref}
                  className="inline-flex items-center justify-center rounded-full border border-primary-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:bg-primary-50"
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
