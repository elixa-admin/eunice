import type { ReactNode } from 'react';

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className = '' }: SurfaceCardProps) {
  return (
    <div
      className={`rounded-[28px] border border-primary-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}
