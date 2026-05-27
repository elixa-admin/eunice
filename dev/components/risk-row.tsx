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
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,rgba(251,248,240,0.98)_0%,rgba(250,245,232,0.98)_100%)] px-4 py-3 shadow-[0_8px_18px_rgba(11,20,12,0.04)]">
      <div className="text-sm text-slate-700">{label}</div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass}`}>{value}</span>
    </div>
  );
}
