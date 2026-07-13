import React from 'react';

export interface FilterGroupProps {
  title: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({ title, options, selectedValue, onChange }) => {
  return (
    <div className="flex flex-col gap-sm">
      <span className="font-label-caps text-xs text-on-surface-variant font-bold uppercase tracking-wider select-none">
        {title}
      </span>
      <div className="grid grid-cols-2 gap-2.5 mt-1">
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`inline-flex items-center justify-center px-4 h-11 rounded-full! text-sm font-semibold border transition-all duration-150 cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-primary border-primary text-white shadow-sm'
                  : 'bg-surface-container border-outline-variant/40 text-on-secondary-container hover:bg-surface-container-high'
              }`}
              type="button">
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
