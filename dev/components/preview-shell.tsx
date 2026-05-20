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
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-200/80">{eyebrow}</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">{description}</p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            {meta}
            <Link href={backHref} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
              {backLabel}
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
