import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        'rounded-xl bg-glass backdrop-blur-md p-6 shadow-glass border border-neutral-200 border-opacity-30',
        className,
      )}
    >
      {children}
    </div>
  );
};
