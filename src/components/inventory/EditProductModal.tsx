import FormField from '@/components/inventory/FormField';
import { Product } from '@/data/productsData';
import { useEditProduct } from '@/hooks/useEditProduct';
import { IonIcon, IonModal } from '@ionic/react';
import { checkmarkCircleOutline, closeOutline, cloudUploadOutline, cubeOutline, imageOutline, pencilOutline, pricetagOutline, trashOutline, walletOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: (originalId: string, product: Product) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose, onProductUpdated, }) => {const { form, errors, imagePreview, fileInputRef, submitting, submitError, handleFieldChange, handleImageChange, removeImage, handleSubmit, isDirty, } = useEditProduct({ product, onSuccess: onProductUpdated, onClose, });

  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [imagePreview]);

  // Controla el cierre manual desde los botones de la UI (Cancelar e icono X).
  // Intercepta el evento antes de cambiar el estado del padre para evaluar cambios sin guardar.
  const handleCloseAttempt = () => {
    if (isDirty) {
      const confirmClose = window.confirm('Tienes cambios sin guardar. ¿Estás seguro de que deseas salir?');
      if (!confirmClose) return;
    }
    onClose();
  };

  // Callback nativo para <IonModal>.
  // Intercepta cierres implícitos del framework (gesto hacia abajo en iOS, tecla Escape o click en el fondo).
  const handleCanDismiss = async () => {
    if (isDirty) {
      const confirmClose = window.confirm('Tienes cambios sin guardar. ¿Estás seguro de que deseas salir?');
      return confirmClose;
    }
    return true;
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} canDismiss={handleCanDismiss} className="add-product-modal">
      <div className="absolute inset-0 flex flex-col bg-surface-container-lowest overflow-hidden">
        
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10 shrink-0">
          <div className="flex items-center gap-sm">
            <div className="flex size-10 rounded-xl bg-primary/10 items-center justify-center text-primary shrink-0">
              <IonIcon icon={pencilOutline} className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-h2 text-on-surface select-none leading-tight">
                Editar Producto
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant">
                Modifica los datos del producto
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseAttempt}
            disabled={submitting}
            className="w-8 h-8 rounded-full! bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-all cursor-pointer disabled:opacity-40"
            type="button"
            aria-label="Cerrar"
          >
            <IonIcon icon={closeOutline} className="text-xl" />
          </button>
        </div>

        {/* ── Scrollable Form Body ── */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-6 pb-4 flex flex-col gap-5">
          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 font-label-caps text-xs text-on-surface-variant uppercase tracking-wider font-semibold select-none">
              <IonIcon icon={imageOutline} className="text-sm text-primary" />
              Imagen del producto
            </span>

            {imagePreview ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-outline-variant/30 bg-surface-container-low">
                <img
                  src={hasImageError ? '/placeholder.webp' : imagePreview}
                  alt="Previsualización"
                  className="w-full h-full object-cover"
                  onError={() => setHasImageError(true)}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={submitting}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full! bg-black/50 hover:bg-rose-500/80 text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
                  aria-label="Quitar imagen"
                >
                  <IonIcon icon={trashOutline} className="text-base" />
                </button>
                <div className="absolute bottom-2 left-3">
                  <span className="flex items-center gap-1 font-body-md text-xs text-white/90">
                    <IonIcon icon={checkmarkCircleOutline} className="text-emerald-400" />
                    Imagen seleccionada
                  </span>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={submitting}
                className="w-full h-32 rounded-2xl border-2 border-dashed border-outline-variant/50 hover:border-primary/50 bg-surface-container-low hover:bg-primary/5 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <IonIcon icon={cloudUploadOutline} className="text-xl text-primary" />
                </div>
                <span className="font-body-md text-xs text-outline group-hover:text-primary transition-colors">
                  Toca para subir imagen
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Product ID (Readonly) */}
          <FormField
            id="edit-product-id"
            label="ID del Producto"
            icon={pricetagOutline}
            placeholder=""
            value={form.id}
            disabled={true}
            hint="El ID se actualiza automáticamente según la categoría (solo lectura)."
            onChange={() => {}}
          />

          {/* Product Name */}
          <FormField
            id="edit-product-name"
            label="Nombre del Producto"
            icon={cubeOutline}
            placeholder="Ej: ThinkPad X1 Carbon"
            value={form.name}
            error={errors.name}
            onChange={(v) => handleFieldChange('name', v)}
          />

          {/* Category */}
          <FormField
            id="edit-product-category"
            label="Categoría"
            icon={pricetagOutline}
            placeholder="Ej: Laptops, Monitores, Audio..."
            value={form.category}
            error={errors.category}
            onChange={(v) => handleFieldChange('category', v)}
          />

          {/* Precio */}
          <FormField
            id="edit-product-price"
            label="Precio (S/)"
            icon={walletOutline}
            placeholder="0.00"
            value={form.price}
            error={errors.price}
            type="number"
            hint="Precio unitario en Soles (PEN)"
            onChange={(v) => handleFieldChange('price', v)}
          />

          {/* Error Message */}
          {submitError && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600">
              <IonIcon icon={closeOutline} className="text-lg shrink-0 mt-0.5" />
              <p className="font-body-md text-sm">{submitError}</p>
            </div>
          )}
        </div>

        {/* ── Footer Actions ── */}
        <div className="flex gap-sm px-6 pt-4 pb-[calc(20px+env(safe-area-inset-bottom))] border-t border-outline-variant/10 bg-surface-container-lowest shrink-0">
          <button
            onClick={handleCloseAttempt}
            disabled={submitting}
            className="flex-1 h-12 border border-outline-variant/50 hover:bg-outline-variant/10 active:bg-outline-variant/20 rounded-2xl! font-body-md font-semibold text-outline hover:text-on-surface transition-all cursor-pointer disabled:opacity-40"
            type="button">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-2 h-12 bg-primary hover:bg-primary-tint active:scale-95 text-white rounded-2xl! font-body-md font-semibold transition-all shadow-button flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
            type="button">
            {submitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
                Guardando...
              </>
            ) : (
              <>
                Guardar Cambios
              </>
            )}
          </button>
        </div>

      </div>
    </IonModal>
  );
};

export default EditProductModal;
