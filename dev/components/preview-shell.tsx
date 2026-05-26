import Image from 'next/image';
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f4e8_0%,#f6f1e4_28%,#f8f6ef_100%)] text-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[linear-gradient(90deg,rgba(17,54,36,0.06)_1px,transparent_1px),linear-gradient(rgba(17,54,36,0.06)_1px,transparent_1px)] bg-[size:58px_58px] opacity-55"
      />
      <div className="relative w-full px-4 py-5 sm:px-5 lg:px-6 2xl:px-8">
        <div className="mb-5 overflow-hidden rounded-[26px] border border-[#0f3c28]/35 bg-[#073820] px-5 py-5 shadow-[0_20px_48px_rgba(11,20,12,0.18)] lg:px-6 lg:py-5">
          <div className="mb-5 h-1 w-full rounded-full bg-[#b88907]" />
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/16 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/40 bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Eunice Admissions
              </span>
              <span className="rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                {surfaceInfo.accent}
              </span>
            </div>
            <div className="rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs font-medium text-white">
              Live dev preview
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)] lg:items-start">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-[0_10px_24px_rgba(11,20,12,0.12)]">
                    <Image src="/eunice-school-logo.svg" alt="Eunice Girls School logo" width={32} height={32} className="h-8 w-8 object-contain" />
                  </div>
                  <div className="text-sm uppercase tracking-[0.22em] text-white/75">Eunice High School</div>
                </div>
                <p className="type-label text-white/80">{eyebrow}</p>
                <h1 className="display-serif type-display-lg max-w-4xl text-white">
                  {title}
                </h1>
                <p className="type-body max-w-3xl text-white/90">{description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {surfaceInfo.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-[24px] border border-white/22 bg-white/10 p-5 backdrop-blur-md">
                <div className="type-label text-white/80">Preview frame</div>
                <p className="type-body mt-2 text-white/95">{surfaceInfo.lead}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {meta}
                <Link
                  href={backHref}
                  className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/12 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  {backLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-5">{children}</div>
      </div>
    </div>
  );
}
