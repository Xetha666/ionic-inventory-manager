import { IonIcon } from '@ionic/react';
import { optionsOutline, searchOutline } from 'ionicons/icons';
import React from 'react';

export interface InventoryHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  activeFiltersCount?: number;
}

const InventoryHeader: React.FC<{ headerProps: InventoryHeaderProps }> = ({
  headerProps,
}) => {
  const {
    searchValue,
    onSearchChange,
    onFilterClick,
    activeFiltersCount = 0,
  } = headerProps;

  return (
    <header className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/30 shadow-sm px-container-padding py-3 w-full flex gap-sm items-center">
      {/* Search Input Container */}
      <div className="relative flex-1 group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
          <IonIcon icon={searchOutline} className="text-xl" />
        </div>
        <input
          className="w-full pl-10 pr-4 h-12 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl text-body-md font-body-md text-on-surface placeholder-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm"
          placeholder="Buscar por ID o Nombre..."
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Button */}
      <button
        onClick={onFilterClick}
        className={`size-12 sm:w-auto sm:px-4 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl! flex items-center justify-center gap-2 text-on-surface hover:bg-surface-container-low transition-colors shadow-sm shrink-0 active:scale-95 cursor-pointer relative appearance-none ${
          activeFiltersCount > 0 ? 'border-primary/50 text-primary bg-primary-fixed/10' : ''
        }`}
        type="button"
        aria-label="Filtros"
      >
        <IonIcon icon={optionsOutline} className="text-xl" />
        <span className="font-label-caps text-xs hidden sm:inline-block font-semibold uppercase tracking-wider">
          Filtros
        </span>
        {activeFiltersCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-xs size-5 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm z-50 animate-in fade-in zoom-in duration-200">
            {activeFiltersCount}
          </span>
        )}
      </button>
    </header>
  );
};

export default InventoryHeader;
