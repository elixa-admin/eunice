import type { ReactNode } from 'react';

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className = '' }: SurfaceCardProps) {
  return (
    <div
      className={`rounded-[26px] border border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,245,236,0.97))] shadow-[0_18px_48px_rgba(15,23,42,0.09)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] ${className}`}
    >
      {children}
    </div>
  );
}
