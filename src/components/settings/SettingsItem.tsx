import { IonIcon } from '@ionic/react';
import { chevronForwardOutline, openOutline } from 'ionicons/icons';
import React from 'react';

export interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle: string;
  isExternal?: boolean;
  iconBgClass?: string;
  iconColorClass?: string;
  onClick?: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  isExternal = false,
  iconBgClass = 'bg-primary/10',
  iconColorClass = 'text-primary',
  onClick,
}) => {
  return (
    <button
      className="w-full flex items-center justify-between py-settings-item-y px-settings-item-x hover:bg-surface-container/30 active:bg-surface-container/60 transition-colors cursor-pointer text-left focus:outline-none"
      type="button"
      onClick={onClick}
    >
      <div className="flex items-center gap-md m-3">
        {/* Icon Container */}
        <div
          className={`flex size-10  rounded-xl ${iconBgClass} items-center justify-center shrink-0`}
        >
          <IonIcon icon={icon} className={`${iconColorClass} text-xl`} />
        </div>

        {/* Text Section */}
        <div className="flex flex-col min-w-0">
          <span className="font-body-md text-body-md font-semibold text-on-surface">
            {title}
          </span>
          <span className="text-xs text-outline truncate mt-0.5">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Action Indicator */}
      <IonIcon
        icon={isExternal ? openOutline : chevronForwardOutline}
        className="text-outline-variant hover:text-on-surface-variant text-lg shrink-0 mr-3"
      />
    </button>
  );
};

export default SettingsItem;
