'use client';

import type { ParentWorkflowStepKey } from '@/lib/dev-preview-data';

type ParentWorkflowStepMeta = Record<
  ParentWorkflowStepKey,
  {
    title: string;
    subtitle: string;
    label: string;
  }
>;

type ParentWorkflowStepperProps = {
  activeTab: ParentWorkflowStepKey;
  activeIndex: number;
  onStepChange: (step: ParentWorkflowStepKey) => void;
  stepMeta: ParentWorkflowStepMeta;
  stepOrder: ParentWorkflowStepKey[];
};

export function ParentWorkflowStepper({
  activeTab,
  activeIndex,
  onStepChange,
  stepMeta,
  stepOrder,
}: ParentWorkflowStepperProps) {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
      {stepOrder.map((step, index) => {
        const isActive = activeTab === step;
        const isDone = index < activeIndex;

        return (
          <button
            key={step}
            onClick={() => onStepChange(step)}
            className={`min-w-[128px] rounded-2xl border p-3 text-left transition ${
              isActive
                ? 'border-amber-300 bg-[#fff8e7] text-[#081c12] shadow-[0_12px_24px_rgba(202,138,4,0.10)]'
                : isDone
                  ? 'border-white/22 bg-white/14 text-white'
                  : 'border-white/15 bg-white/8 text-white/82 hover:bg-white/12'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                  isActive ? 'border-[#081c12] bg-[#081c12] text-white' : 'border-current/20 bg-white/12 text-current'
                }`}
              >
                {stepMeta[step].label}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-85">{stepMeta[step].title}</div>
                <div className="mt-1 text-[11px] opacity-80">{stepMeta[step].subtitle}</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
