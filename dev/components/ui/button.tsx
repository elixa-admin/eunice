import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className,
  children,
  ...props
}) => {
  const base = 'rounded-md font-medium transition-colors px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const styles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-300',
    secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-400',
  };
  const combinedClassName = [base, styles[variant], className].filter(Boolean).join(' ');
  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
