import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  const combinedClassName = [
    'rounded-xl bg-glass backdrop-blur-md p-6 shadow-glass border border-neutral-200 border-opacity-30',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
};
