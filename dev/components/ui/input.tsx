import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  const wrapperClassName = ['flex flex-col space-y-1', className].filter(Boolean).join(' ');
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
      )}
      <input
        className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
        {...props}
      />
    </div>
  );
};
