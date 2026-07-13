import { IonIcon } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';
import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  icon: string;
  placeholder: string;
  value: string;
  error?: string;
  type?: string;
  hint?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const FormField: React.FC<FormFieldProps> = ({id,label,icon,placeholder,value,error,type = 'text',hint,disabled = false,onChange}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="flex items-center gap-1.5 font-label-caps text-xs text-on-surface-variant uppercase tracking-wider font-semibold select-none">
      <IonIcon icon={icon} className="text-sm text-primary" />
      {label}
    </label>
    <div className={`w-full rounded-2xl ${disabled ? 'cursor-not-allowed' : ''}`}>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full h-12 px-4 rounded-2xl border font-body-md text-body-md placeholder:text-outline/60 outline-none transition-all duration-200
          ${disabled
            ? 'bg-surface-container-highest border-outline-variant/30 text-on-surface-variant/40 select-none pointer-events-none'
            : 'bg-surface-container-low border-outline-variant/40 hover:border-outline-variant/70 text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary'
          }
          ${error && !disabled
            ? 'border-rose-500/60 focus:ring-rose-500/20 focus:border-rose-500'
            : ''
          }`}
        min={type === 'number' ? '0' : undefined}
      />
    </div>
    {error && (
      <p className="flex items-center gap-1 text-rose-500 font-body-md text-xs">
        <IonIcon icon={alertCircleOutline} className="text-sm shrink-0" />
        {error}
      </p>
    )}
    {hint && !error && (
      <p className="font-body-md text-xs text-outline/70">{hint}</p>
    )}
  </div>
);

export default FormField;
