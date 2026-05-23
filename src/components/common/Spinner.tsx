import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Border color e.g. 'border-white' or 'border-primary'
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'border-white',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'size-4 border-[1.5px]',
    md: 'size-5 border-2',
    lg: 'size-8 border-[3px]',
  };

  return (
    <div
      className={`rounded-full border-t-transparent animate-spin ${sizeClasses[size]} ${color} ${className}`}
      role="status"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

export default Spinner;
