import { FilterGroup } from '@/components/inventory/FilterGroup';
import { getCategoryOptions, sortOptions, statusOptions } from '@/data/filterOptions';
import { IonIcon, IonModal } from '@ionic/react';
import { closeOutline, optionsOutline } from 'ionicons/icons';
import React from 'react';

export interface InventoryFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSort: string;
  onSortChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  categories: string[];
  onClearAll: () => void;
}

const InventoryFilterModal: React.FC<{ filterModalProps: InventoryFilterModalProps }> = ({
  filterModalProps,
}) => {
  const {
    isOpen,
    onClose,
    selectedSort,
    onSortChange,
    selectedStatus,
    onStatusChange,
    selectedCategory,
    onCategoryChange,
    categories,
    onClearAll,
  } = filterModalProps;

  const categoryOptions = getCategoryOptions(categories);

  const handleClearFilters = () => {
    onClearAll();
    onClose();
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      className="filter-modal"
    >
      <div className="absolute inset-0 flex flex-col bg-surface-container-lowest overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10 shrink-0">
          <div className="flex items-center gap-sm">
            <div className="flex size-10 rounded-xl bg-primary/10 items-center justify-center text-primary">
              <IonIcon icon={optionsOutline} className="text-xl" />
            </div>
            <h2 className="text-lg font-bold font-h2 text-on-surface select-none">
              Filtros de Inventario
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full! bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-all cursor-pointer"
            type="button"
            aria-label="Cerrar">
            <IonIcon icon={closeOutline} className="text-xl" />
          </button>
        </div>

        {/* Filters Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-lg">
          {/* Section: Order By */}
          <FilterGroup
            title="Ordenar por"
            options={sortOptions}
            selectedValue={selectedSort}
            onChange={onSortChange}
          />

          <hr className="border-outline-variant/20 my-1" />

          {/* Section: Stock Status */}
          <FilterGroup
            title="Estado de Stock"
            options={statusOptions}
            selectedValue={selectedStatus}
            onChange={onStatusChange}
          />

          <hr className="border-outline-variant/20 my-1" />

          {/* Section: Dynamic Categories */}
          <FilterGroup
            title="Categoría"
            options={categoryOptions}
            selectedValue={selectedCategory}
            onChange={onCategoryChange}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex gap-sm px-6 pt-5 pb-[calc(20px+env(safe-area-inset-bottom))] border-t border-outline-variant/10 bg-surface-container-lowest shrink-0">
          <button
            onClick={handleClearFilters}
            className="flex-1 h-12 border border-outline-variant/50 hover:bg-outline-variant/10 active:bg-outline-variant/20 rounded-2xl! font-body-md font-semibold text-outline hover:text-on-surface transition-all cursor-pointer"
            type="button">
            Limpiar Filtros
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-12 bg-primary hover:bg-primary-tint active:scale-95 text-white rounded-2xl! font-body-md font-semibold transition-all shadow-button flex items-center justify-center cursor-pointer"
            type="button">
            Aplicar
          </button>
        </div>
      </div>
    </IonModal>
  );
};

export default InventoryFilterModal;
