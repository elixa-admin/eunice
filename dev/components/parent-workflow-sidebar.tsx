'use client';

import { SummaryRow } from '@/components/summary-row';
import { StatusBadge } from '@/components/status-badge';
import type { PreviewApplication, ParentWorkflowSnapshot } from '@/lib/dev-preview-data';

type GuidanceItem = {
  title: string;
  body: string;
};

type ParentWorkflowSidebarProps = {
  guidanceItems: readonly GuidanceItem[];
  featuredApplication: PreviewApplication;
  primaryActionLabel: string;
  progress: number;
  readinessTone: 'rose' | 'amber' | 'emerald';
  stepActionSummary: string;
  stepNext: string;
  workflow: ParentWorkflowSnapshot;
};

export function ParentWorkflowSidebar({
  guidanceItems,
  featuredApplication,
  primaryActionLabel,
  progress,
  readinessTone,
  stepActionSummary,
  stepNext,
  workflow,
}: ParentWorkflowSidebarProps) {
  const progressBorderClass =
    readinessTone === 'rose'
      ? 'border-rose-200 text-rose-800'
      : readinessTone === 'amber'
        ? 'border-amber-200 text-amber-900'
        : 'border-emerald-200 text-emerald-800';

  const readinessPanelClass =
    readinessTone === 'rose'
      ? 'border-rose-200 bg-rose-50/80'
      : readinessTone === 'amber'
        ? 'border-amber-200 bg-amber-50/80'
        : 'border-emerald-200 bg-emerald-50/80';

  const readinessLabelClass =
    readinessTone === 'rose' ? 'text-rose-800' : readinessTone === 'amber' ? 'text-amber-800' : 'text-emerald-800';

  return (
    <div className="space-y-3">
      <div className="rounded-[24px] border border-primary-200 bg-[linear-gradient(180deg,rgba(255,248,231,0.99)_0%,rgba(255,243,216,0.98)_100%)] p-4 shadow-[0_14px_32px_rgba(11,20,12,0.08)] ring-1 ring-white/45">
        <div className="text-[11px] uppercase tracking-[0.18em] text-primary-900/70">Your next move</div>
        <div className="mt-2 text-lg font-semibold text-slate-950">{primaryActionLabel}</div>
        <p className="mt-2 text-sm leading-6 text-slate-700">{stepActionSummary}</p>
        <div className="mt-3 rounded-2xl border border-primary-200 bg-white/82 px-3 py-3 text-sm leading-6 text-slate-700">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">What happens after this</div>
          <p className="mt-1">{stepNext}</p>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(250,247,240,0.98)_100%)] p-4 text-slate-950 shadow-[0_12px_28px_rgba(11,20,12,0.06)] xl:min-h-[236px]">
        <div className="text-xs uppercase tracking-[0.16em] text-slate-700">Application Summary</div>
        <div className="mt-3.5 grid gap-2.5 text-sm">
          <SummaryRow label="Application ID" value={featuredApplication.ref} />
          <SummaryRow label="Started" value="22 May 2026" />
          <SummaryRow label="Last saved" value={`22 May 2026, ${workflow.blockers.length > 0 ? '14:35' : '14:10'}`} />
          <SummaryRow label="Status" value={<StatusBadge status={featuredApplication.status} />} />
        </div>
        <button className="mt-4 w-full rounded-2xl bg-primary-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(11,20,12,0.16)]">
          {primaryActionLabel}
        </button>
      </div>

      <div className={`border p-4 text-slate-950 shadow-[0_12px_28px_rgba(11,20,12,0.06)] xl:min-h-[160px] ${readinessPanelClass}`}>
        <div className={`text-xs uppercase tracking-[0.16em] ${readinessLabelClass}`}>Progress</div>
        <div className="mt-3.5 flex items-center gap-4">
          <div className={`flex h-20 w-20 items-center justify-center rounded-full border bg-white text-2xl font-semibold ${progressBorderClass}`}>
            {progress}%
          </div>
          <div className="text-sm leading-6 text-slate-700">
            Your application is moving forward. Keep documents ready so the admissions team can review it faster and keep the process calm.
          </div>
        </div>
      </div>

      <details className="group rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,247,240,0.98)_100%)] p-4 shadow-[0_12px_28px_rgba(11,20,12,0.06)]">
        <summary className="cursor-pointer list-none text-sm font-semibold text-slate-950">Need a little help?</summary>
        <div className="mt-3 space-y-2 rounded-2xl border border-slate-200 bg-white/85 px-3 py-3">
          <p className="text-sm leading-6 text-slate-700">
            Keep the flow calm: start with the right adult, keep the essentials nearby, and save whenever you need a pause.
          </p>
          <div className="space-y-2 border-t border-slate-100 pt-2">
            {guidanceItems.map((item) => (
              <div key={item.title} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-800" />
                <span>
                  <span className="font-semibold text-slate-950">{item.title}:</span> {item.body}
                </span>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
