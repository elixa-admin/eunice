import type { ReactNode } from 'react';

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className = '' }: SurfaceCardProps) {
  return (
    <div
      className={`rounded-[28px] border border-primary-100/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,248,241,0.95))] shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
