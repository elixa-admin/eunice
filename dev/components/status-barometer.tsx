type StatusBarometerProps = {
  label: string;
  value: number;
  tone: 'rose' | 'amber' | 'emerald';
  detail: string;
};

export function StatusBarometer({ label, value, tone, detail }: StatusBarometerProps) {
  const ring =
    tone === 'rose'
      ? 'border-rose-300 text-rose-700'
      : tone === 'amber'
        ? 'border-amber-300 text-amber-800'
        : 'border-emerald-300 text-emerald-700';
  const accent =
    tone === 'rose'
      ? 'bg-rose-500'
      : tone === 'amber'
        ? 'bg-amber-500'
        : 'bg-emerald-500';
  const surface =
    tone === 'rose'
      ? 'border-rose-200 bg-[linear-gradient(180deg,rgba(255,246,247,0.98)_0%,rgba(255,240,242,0.98)_100%)]'
      : tone === 'amber'
        ? 'border-amber-200 bg-[linear-gradient(180deg,rgba(255,250,240,0.98)_0%,rgba(255,246,232,0.98)_100%)]'
        : 'border-emerald-200 bg-[linear-gradient(180deg,rgba(244,253,248,0.98)_0%,rgba(236,250,242,0.98)_100%)]';

  return (
    <div className={`rounded-[24px] border p-3.5 shadow-[0_14px_28px_rgba(0,0,0,0.12)] ring-1 ring-white/55 ${surface}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
          <div className="mt-1 text-sm font-semibold text-slate-950">{detail}</div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-full border bg-white text-sm font-semibold shadow-sm ${ring}`}>{value}</div>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
        <div className={`h-full rounded-full ${accent}`} style={{ width: `${Math.max(18, Math.min(100, value * 22))}%` }} />
      </div>
    </div>
  );
}
