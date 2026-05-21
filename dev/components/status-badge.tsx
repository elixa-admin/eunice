import { previewStatusClasses, type PreviewStatus } from '@/lib/dev-preview-data';

type StatusBadgeProps = {
  status: PreviewStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${previewStatusClasses[status]}`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}
