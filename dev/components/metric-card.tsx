type MetricCardProps = {
  label: string;
  value: string;
};

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-[24px] border border-white/12 bg-white/12 p-4 backdrop-blur-md">
      <div className="text-xs uppercase tracking-[0.16em] text-white/70">{label}</div>
      <div className="mt-2 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
