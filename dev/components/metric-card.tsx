type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
};

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <div className="rounded-[24px] border border-primary-100 bg-[linear-gradient(180deg,rgba(255,253,248,0.99)_0%,rgba(247,243,233,0.98)_100%)] p-4 shadow-[0_16px_34px_rgba(11,20,12,0.08)] ring-1 ring-white/60">
      <div className="text-[11px] uppercase tracking-[0.18em] text-primary-700/72">{label}</div>
      <div className="mt-2 text-base font-semibold text-slate-950">{value}</div>
      {detail ? <div className="mt-1 text-xs leading-5 text-slate-600">{detail}</div> : null}
    </div>
  );
}
