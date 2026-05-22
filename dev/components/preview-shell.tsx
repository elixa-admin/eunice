import Link from 'next/link';
import React from 'react';

type PreviewShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
  meta?: React.ReactNode;
};

export function PreviewShell({
  eyebrow,
  title,
  description,
  backHref = '/dev',
  backLabel = 'Back to preview hub',
  children,
  meta,
}: PreviewShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(202,138,4,0.10),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.06),_transparent_26%),linear-gradient(180deg,_#fbfef9_0%,_#f7fbf4_44%,_#f8fafc_100%)] text-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[linear-gradient(90deg,rgba(21,128,61,0.04)_1px,transparent_1px),linear-gradient(rgba(21,128,61,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 overflow-hidden rounded-[32px] border border-primary-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(247,250,247,0.92))] px-6 py-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] lg:px-8 lg:py-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary-700/80">{eyebrow}</p>
            <h1 className="display-serif text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
          </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              {meta}
              <Link
                href={backHref}
                className="rounded-xl border border-primary-100 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-primary-200 hover:bg-primary-50"
              >
                {backLabel}
              </Link>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
