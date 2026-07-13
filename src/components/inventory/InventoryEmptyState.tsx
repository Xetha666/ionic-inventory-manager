import { IonIcon } from '@ionic/react';
import { archiveOutline } from 'ionicons/icons';
import React from 'react';

interface InventoryEmptyStateProps {
  onClearFilters: () => void;
  totalCount: number;
}

export const InventoryEmptyState: React.FC<InventoryEmptyStateProps> = ({onClearFilters,totalCount}) => {
  const isCatalogEmpty = totalCount === 0;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-md text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm gap-md">
      <div className="size-16 rounded-2xl bg-surface-variant/30 flex items-center justify-center text-outline">
        <IonIcon icon={archiveOutline} className="text-3xl" />
      </div>
      <div className="flex flex-col gap-xs">
        <h3 className="font-h2 text-base font-semibold text-on-surface">
          {isCatalogEmpty ? 'Tu catálogo está vacío' : 'No se encontraron productos'}
        </h3>
        <p className="font-body-md text-sm text-on-surface-variant max-w-2xs text-center">
          {isCatalogEmpty
            ? 'Comienza a agregar productos al catálogo presionando el botón "+" flotante.'
            : 'Intenta modificando tu búsqueda o restableciendo los filtros activos.'}
        </p>
      </div>
      {!isCatalogEmpty && (
        <button
          onClick={onClearFilters}
          className="h-10 px-4! bg-primary hover:bg-primary-tint active:scale-95 text-white text-sm font-semibold rounded-xl! py-3! transition-all shadow-sm cursor-pointer"
          type="button">
          Limpiar Filtros
        </button>
      )}
    </div>
  );
};

export default InventoryEmptyState;
