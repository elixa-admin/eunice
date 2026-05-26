type RiskRowProps = {
  label: string;
  value: number;
  tone: 'rose' | 'amber' | 'emerald';
};

export function RiskRow({ label, value, tone }: RiskRowProps) {
  const toneClass =
    tone === 'rose'
      ? 'bg-rose-100 text-rose-700'
      : tone === 'amber'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-emerald-100 text-emerald-700';

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-[#fbf8f0] px-4 py-3">
      <div className="text-sm text-slate-700">{label}</div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass}`}>{value}</span>
    </div>
  );
}
