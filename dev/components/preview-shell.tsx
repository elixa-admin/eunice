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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.10),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(202,138,4,0.09),_transparent_24%),linear-gradient(180deg,_#f8fcf7_0%,_#f5fbf4_48%,_#f8fafc_100%)] text-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[linear-gradient(90deg,rgba(21,128,61,0.04)_1px,transparent_1px),linear-gradient(rgba(21,128,61,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-60"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
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
        {children}
      </div>
    </div>
  );
}
