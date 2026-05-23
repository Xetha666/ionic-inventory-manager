import React from 'react';
import SettingsItem, { SettingsItemProps } from './SettingsItem';

interface SettingsGroupProps {
  label: string;
  items: SettingsItemProps[];
}

const SettingsGroup: React.FC<SettingsGroupProps> = ({ label, items }) => {
  return (
    <div className="flex flex-col gap-sm">
      {/* Group Header Label */}
      <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider pl-xs">
        {label}
      </h3>

      {/* Card Container for Items */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-card overflow-hidden flex flex-col">
        {items.map((item, index) => (
          <React.Fragment key={item.title}>
            <SettingsItem {...item} />
            {index < items.length - 1 && (
              <div className="border-b border-outline-variant/20 mx-md"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SettingsGroup;
