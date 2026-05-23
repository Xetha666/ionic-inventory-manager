import React from 'react';

export interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  faded?: boolean;
}

const Separator: React.FC<SeparatorProps> = ({
  className = '',
  orientation = 'horizontal',
  faded = false,
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={`
        shrink-0
        ${isHorizontal ? 'h-px w-full' : 'w-px h-full'}
        ${
          faded
            ? isHorizontal
              ? 'bg-linear-to-r from-transparent via-outline/20 to-transparent'
              : 'bg-linear-to-b from-transparent via-outline/20 to-transparent'
            : 'bg-outline/20'
        }
        ${className}
      `}
      role="separator"
    />
  );
};

export default Separator;
