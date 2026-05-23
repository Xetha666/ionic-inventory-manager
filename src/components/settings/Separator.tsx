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
        ${isHorizontal ? 'h-[1px] w-full' : 'w-[1px] h-full'}
        ${
          faded
            ? isHorizontal
              ? 'bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent'
              : 'bg-gradient-to-b from-transparent via-outline-variant/30 to-transparent'
            : 'bg-outline-variant/20'
        }
        ${className}
      `}
      role="separator"
    />
  );
};

export default Separator;
