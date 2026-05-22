import type { ReactNode } from 'react';

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className = '' }: SurfaceCardProps) {
  return (
    <div
      className={`rounded-[28px] border border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,243,234,0.96))] shadow-[0_22px_60px_rgba(15,23,42,0.10)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(15,23,42,0.14)] ${className}`}
    >
      {children}
    </div>
  );
}
