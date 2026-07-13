import { Product } from '@/data/productsData';
import { statusStyles } from '@/data/statusStyles';
import { useScannerStock } from '@/hooks/useScannerStock';
import { formatPricePEN } from '@/utils/scannerUtils';
import { IonIcon, IonModal } from '@ionic/react';
import { addOutline, checkmarkCircleOutline, closeOutline, cubeOutline, removeOutline, saveOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';

interface ScannerProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onStockUpdated: () => void;
}

const ScannerProductModal: React.FC<ScannerProductModalProps> = ({product,isOpen,onClose,onStockUpdated}) => {
  const {stock,currentStatus,hasChanges,saving,saveError,showSuccessToast,increment,decrement,save,} = useScannerStock({ product, onSaved: onStockUpdated, onClose });

  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    if (product) setHasImageError(false);
  }, [product]);

  if (!product) return null;

  const currentStatusStyle = statusStyles[currentStatus] || statusStyles.Disponible;
  const imgSrc = !hasImageError && product.image_url ? product.image_url : '/placeholder.webp';

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onClose} className="add-product-modal">
        <div className="absolute inset-0 flex flex-col bg-surface-container-lowest overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10 shrink-0">
            <div className="flex items-center gap-sm">
              <div className="flex size-10 rounded-xl bg-primary/10 items-center justify-center text-primary shrink-0">
                <IonIcon icon={cubeOutline} className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-h2 text-on-surface select-none leading-tight">
                  Producto Detectado
                </h2>
                <p className="font-body-md text-xs text-on-surface-variant">
                  Información y control de stock
                </p>
              </div>
            </div>
            <button onClick={onClose} disabled={saving} className="w-8 h-8 rounded-full! bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-all cursor-pointer disabled:opacity-40" type="button" aria-label="Cerrar">
              <IonIcon icon={closeOutline} className="text-xl" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-lg">

            {/* Product Card */}
            <div className="flex gap-md bg-surface p-md rounded-2xl border border-outline-variant/20 shadow-card">
              <div className="w-20 h-20 rounded-xl bg-surface-variant overflow-hidden shrink-0 border border-outline-variant/20 flex items-center justify-center">
                <img
                  alt={product.name}
                  className="w-full h-full object-cover"
                  src={imgSrc}
                  onError={() => setHasImageError(true)}
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="font-h2 text-body-lg font-bold text-on-surface truncate">
                  {product.name}
                </h3>
                <span className="inline-block self-start px-2 py-0.5 mt-1 bg-surface-container-high text-on-surface-variant rounded-md text-[10px] uppercase font-bold tracking-wider font-label-caps">
                  {product.category}
                </span>
                <p className="font-body-md text-xs text-outline mt-1">
                  ID/Code: {product.id}
                </p>
              </div>
            </div>

            {/* Price & Status Row */}
            <div className="grid grid-cols-2 gap-md">
              <div className="bg-surface p-md rounded-2xl border border-outline-variant/20 flex flex-col">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  Precio Unitario
                </span>
                <span className="font-data-tabular text-h2 font-semibold text-primary mt-1">
                  {formatPricePEN(product.price ?? 0)}
                </span>
              </div>
              <div className="bg-surface p-md rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  Estado de Stock
                </span>
                <div className={`h-7 px-3 mt-1.5 rounded-full ${currentStatusStyle.bg} ${currentStatusStyle.border} ${currentStatusStyle.text} border flex items-center justify-center self-start`}>
                  <span className="font-label-caps text-xs font-bold tracking-wider uppercase">
                    {currentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Stepper */}
            <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 flex flex-col items-center gap-md">
              <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider font-semibold select-none">
                Ajustar Cantidad Disponible
              </span>
              <div className="flex items-center gap-lg">
                <button type="button" onClick={decrement} disabled={saving || stock === 0} className="w-12 h-12 rounded-full! bg-surface-container hover:bg-surface-container-high active:scale-90 flex items-center justify-center text-on-surface-variant transition-all cursor-pointer disabled:opacity-40 disabled:scale-100">
                  <IonIcon icon={removeOutline} className="text-xl" />
                </button>
                <span className="w-16 text-center font-data-tabular text-3xl font-bold text-on-surface">
                  {stock}
                </span>
                <button type="button" onClick={increment} disabled={saving} className="w-12 h-12 rounded-full! bg-surface-container hover:bg-surface-container-high active:scale-90 flex items-center justify-center text-on-surface-variant transition-all cursor-pointer disabled:opacity-40">
                  <IonIcon icon={addOutline} className="text-xl" />
                </button>
              </div>
              {hasChanges && (
                <p className="font-body-md text-xs text-primary animate-pulse font-semibold mt-1">
                  Cantidad anterior: {product.stock} → Nueva: {stock}
                </p>
              )}
            </div>

            {/* Error */}
            {saveError && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600">
                <p className="font-body-md text-sm">{saveError}</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-sm px-6 pt-4 pb-[calc(20px+env(safe-area-inset-bottom))] border-t border-outline-variant/10 bg-surface-container-lowest shrink-0">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 h-12 border border-outline-variant/50 hover:bg-outline-variant/10 active:bg-outline-variant/20 rounded-2xl! font-body-md font-semibold text-outline hover:text-on-surface transition-all cursor-pointer disabled:opacity-40"
              type="button"
            >
              Cancelar
            </button>
            <button
              onClick={save}
              disabled={saving || !hasChanges}
              className="flex-2 h-12 bg-primary hover:bg-primary-tint active:scale-95 text-white rounded-2xl! font-body-md font-semibold transition-all shadow-button flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
              type="button"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
                  Guardando...
                </>
              ) : (
                <>
                  <IonIcon icon={saveOutline} className="text-lg" />
                  Guardar Stock
                </>
              )}
            </button>
          </div>
        </div>
      </IonModal>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-bounce">
          <IonIcon icon={checkmarkCircleOutline} className="text-xl" />
          <span className="font-body-md font-semibold text-sm">Stock actualizado con éxito</span>
        </div>
      )}
    </>
  );
};

export default ScannerProductModal;
