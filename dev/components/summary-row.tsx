import type React from 'react';

type SummaryRowProps = {
  label: string;
  value: React.ReactNode;
};

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-[#fbf8f0] px-4 py-3">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-700">{label}</div>
      <div className="text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}
