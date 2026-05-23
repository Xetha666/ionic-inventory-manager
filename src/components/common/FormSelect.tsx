import React from 'react';
import { IonIcon } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';

interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: string; // IonIcon icon string
  options: FormSelectOption[];
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  icon,
  options,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-xs">
      <label className="text-xs font-semibold text-outline-variant tracking-wider uppercase pl-1">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <IonIcon
            icon={icon}
            className="absolute left-3 text-outline text-lg pointer-events-none"
          />
        )}
        <select
          disabled={disabled}
          className={`w-full h-11 pr-10 rounded-xl border border-outline-variant/30 bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md text-on-surface font-medium transition-all appearance-none cursor-pointer ${
            icon ? 'pl-10' : 'pl-4'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <IonIcon
          icon={chevronDownOutline}
          className="absolute right-3 text-outline text-lg pointer-events-none"
        />
      </div>
    </div>
  );
};

export default FormSelect;
