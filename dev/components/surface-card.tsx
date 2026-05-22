import type { ReactNode } from 'react';

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className = '' }: SurfaceCardProps) {
  return (
    <div
      className={`rounded-[28px] border border-primary-100/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,247,0.96))] shadow-[0_24px_60px_rgba(15,23,42,0.05)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
