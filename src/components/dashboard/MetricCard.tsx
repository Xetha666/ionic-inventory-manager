import { IonIcon } from '@ionic/react';
import React from 'react';

interface MetricCardProps {
  icon: string;
  value: string;
  label: string;
  variant?: 'default' | 'error';
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  value,
  label,
  variant = 'default',
}) => {
  const isError = variant === 'error';

  const containerClasses = isError
    ? 'bg-error-container/30 border border-error/20'
    : 'bg-surface-container-lowest border border-outline-variant';

  const iconBgClasses = isError
    ? 'bg-error-container'
    : 'bg-surface-container';

  const iconColorClasses = isError ? 'text-error' : 'text-primary';

  const valueClasses = isError
    ? 'text-error'
    : 'text-on-background';

  const labelClasses = isError
    ? 'text-error'
    : 'text-on-surface-variant';

  return (
    <div
      className={`${containerClasses} rounded-xl p-md flex flex-col gap-md shadow-card`}
    >
      <div
        className={`flex w-10 h-10 rounded-full ${iconBgClasses} items-center justify-center`}
      >
        <IonIcon
          icon={icon}
          className={`${iconColorClasses} text-h2`}
        />
      </div>
      <div className="flex flex-col gap-xs">
        <span className={`font-h2 text-h2 ${valueClasses}`}>{value}</span>
        <span
          className={`font-label-caps text-label-caps ${labelClasses} uppercase`}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default MetricCard;
