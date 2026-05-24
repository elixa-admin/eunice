import type { ReactNode } from 'react';

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className = '' }: SurfaceCardProps) {
  return (
    <div
      className={`rounded-[26px] border border-primary-100/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.985),rgba(248,244,232,0.975))] shadow-[0_18px_46px_rgba(11,20,12,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(11,20,12,0.11)] ${className}`}
    >
      {children}
    </div>
  );
}
