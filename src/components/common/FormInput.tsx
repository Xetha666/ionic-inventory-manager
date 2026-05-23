import { IonIcon } from '@ionic/react';
import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string; // IonIcon icon string
  suffix?: React.ReactNode; // Optional right-aligned element
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  icon,
  suffix,
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
        <input
          disabled={disabled}
          className={`w-full h-11 rounded-xl border border-outline-variant/30 bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md text-on-surface font-medium transition-all ${
            icon ? 'pl-10' : 'pl-4'
          } ${suffix ? 'pr-10' : 'pr-4'} ${
            disabled ? 'opacity-60 cursor-not-allowed' : ''
          } ${className}`}
          {...props}
        />
        {suffix && <div className="absolute right-3 flex items-center">{suffix}</div>}
      </div>
    </div>
  );
};

export default FormInput;
