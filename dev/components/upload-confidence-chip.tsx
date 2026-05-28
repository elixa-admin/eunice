type UploadConfidenceChipProps = {
  tone: 'ready' | 'mixed' | 'needs_attention';
  label: string;
  compact?: boolean;
};

const toneClasses: Record<UploadConfidenceChipProps['tone'], string> = {
  ready: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  mixed: 'border-amber-200 bg-amber-50 text-amber-800',
  needs_attention: 'border-rose-200 bg-rose-50 text-rose-700',
};

export function UploadConfidenceChip({ tone, label, compact = false }: UploadConfidenceChipProps) {
  return (
    <span
      className={`rounded-full border font-semibold uppercase tracking-[0.12em] ${toneClasses[tone]} ${
        compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'
      }`}
    >
      {label}
    </span>
  );
}

