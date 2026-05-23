import Separator from './Separator';
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
      <h3 className="font-body-md text-label-sm text-outline uppercase tracking-widest pl-xs">
        {label}
      </h3>

      {/* Card Container for Items */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-card overflow-hidden flex flex-col">
        {items.map((item, index) => (
          <React.Fragment key={item.title}>
            <SettingsItem {...item} />
            {index < items.length - 1 && (
              <div className="px-settings-item-x">
                <Separator faded={true} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SettingsGroup;
