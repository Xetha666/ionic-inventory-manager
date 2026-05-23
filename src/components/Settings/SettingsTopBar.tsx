import { IonIcon } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import React from 'react';

interface SettingsTopBarProps {
  avatarUrl?: string;
  onSearchClick?: () => void;
}

const SettingsTopBar: React.FC<SettingsTopBarProps> = ({
  avatarUrl = '/avatar.png',
  onSearchClick,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/30 shadow-sm flex items-center justify-between px-md h-16 w-full">
      {/* Profile Avatar Thumbnail */}
      <div className="flex items-center gap-stack-gap hover:bg-surface-container transition-colors active:scale-95 duration-150 rounded-full p-1 cursor-pointer">
        <img
          alt="Foto de perfil"
          className="w-8 h-8 rounded-full object-cover border border-outline-variant"
          src={avatarUrl}
        />
      </div>

      {/* Logo/Title */}
      <h1 className="text-xl font-black tracking-tight text-primary">
        InventoryFlow
      </h1>

      {/* Search Button */}
      <button
        aria-label="Buscar"
        className="w-10 h-10 flex items-center justify-center text-outline hover:text-on-surface-variant hover:bg-surface-container rounded-full transition-colors cursor-pointer"
        type="button"
        onClick={onSearchClick}
      >
        <IonIcon icon={searchOutline} className="text-xl" />
      </button>
    </header>
  );
};

export default SettingsTopBar;
