import type { ReactNode } from 'react';

type SectionHeadingProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeading({ title, description, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <div className="h-1 w-10 rounded-full bg-[#b88907]" />
        <h2 className="display-serif type-title text-slate-950">{title}</h2>
        {description ? <p className="type-body text-slate-600">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
