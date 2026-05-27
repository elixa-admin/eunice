type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
};

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <div className="rounded-[24px] border border-[#e7d39a]/28 bg-[linear-gradient(180deg,rgba(17,73,47,0.98)_0%,rgba(11,58,36,0.98)_100%)] p-4 shadow-[0_16px_34px_rgba(0,0,0,0.18)] ring-1 ring-white/5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-[#f0e2b7]/92">{label}</div>
      <div className="mt-2 text-base font-semibold text-white">{value}</div>
      {detail ? <div className="mt-1 text-xs leading-5 text-white/76">{detail}</div> : null}
    </div>
  );
}
