type StatusBarometerProps = {
  label: string;
  value: number;
  tone: 'rose' | 'amber' | 'emerald';
  detail: string;
};

export function StatusBarometer({ label, value, tone, detail }: StatusBarometerProps) {
  const ring =
    tone === 'rose'
      ? 'border-rose-200 text-rose-800'
      : tone === 'amber'
        ? 'border-amber-200 text-amber-900'
        : 'border-emerald-200 text-emerald-800';
  const accent =
    tone === 'rose'
      ? 'bg-rose-500'
      : tone === 'amber'
        ? 'bg-amber-500'
        : 'bg-emerald-500';

  return (
    <div className="rounded-[24px] border border-white/15 bg-white/12 p-3.5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.16em] text-white/70">{label}</div>
          <div className="mt-1 text-sm font-semibold text-white/95">{detail}</div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-full border bg-white text-sm font-semibold ${ring}`}>{value}</div>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/12">
        <div className={`h-full rounded-full ${accent}`} style={{ width: `${Math.max(18, Math.min(100, value * 22))}%` }} />
      </div>
    </div>
  );
}
