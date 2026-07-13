import FormAddProduct from '@/components/inventory/FormAddProduct';
import { Product } from '@/data/productsData';
import { useAddProduct } from '@/hooks/useAddProduct';
import { IonIcon, IonModal } from '@ionic/react';
import { addOutline, alertCircleOutline, closeOutline } from 'ionicons/icons';
import React, { useEffect } from 'react';

interface ScannerRegisterModalProps {
  barcode: string;
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (product: Product) => void;
}

/**
 * Modal for registering a scanned barcode as a new product.
 * Reuses the existing useAddProduct hook with initialId set to the barcode.
 */
const ScannerRegisterModal: React.FC<ScannerRegisterModalProps> = ({barcode,isOpen,onClose,onProductCreated,}) => {const {openModal,closeModal,form,errors,imagePreview,fileInputRef,submitting,submitError,handleFieldChange,handleImageChange,removeImage,handleSubmit,} = useAddProduct({onSuccess: onProductCreated,initialId: barcode,});

  // Sync modal open state: when parent says isOpen, trigger openModal to reset form
  useEffect(() => {
    if (isOpen) {
      openModal();
    }
  }, [isOpen, openModal]);

  const handleClose = () => {
    closeModal();
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose} className="add-product-modal">
      <div className="absolute inset-0 flex flex-col bg-surface-container-lowest overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10 shrink-0">
          <div className="flex items-center gap-sm">
            <div className="flex size-10 rounded-xl bg-amber-500/10 items-center justify-center text-amber-600 shrink-0">
              <IonIcon icon={alertCircleOutline} className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-h2 text-on-surface select-none leading-tight">
                Producto No Registrado
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant">
                Registra el código <span className="font-mono font-bold text-primary">{barcode}</span> en inventario
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="w-8 h-8 rounded-full! bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-all cursor-pointer disabled:opacity-40"
            type="button"
            aria-label="Cerrar"
          >
            <IonIcon icon={closeOutline} className="text-xl" />
          </button>
        </div>

        {/* Reuse standard inventory form */}
        <FormAddProduct
          form={form}
          errors={errors}
          imagePreview={imagePreview}
          fileInputRef={fileInputRef}
          submitting={submitting}
          submitError={submitError}
          handleFieldChange={handleFieldChange}
          handleImageChange={handleImageChange}
          removeImage={removeImage}
        />

        {/* Footer Actions */}
        <div className="flex gap-sm px-6 pt-4 pb-[calc(20px+env(safe-area-inset-bottom))] border-t border-outline-variant/10 bg-surface-container-lowest shrink-0">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="flex-1 h-12 border border-outline-variant/50 hover:bg-outline-variant/10 active:bg-outline-variant/20 rounded-2xl! font-body-md font-semibold text-outline hover:text-on-surface transition-all cursor-pointer disabled:opacity-40"
            type="button"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-2 h-12 bg-primary hover:bg-primary-tint active:scale-95 text-white rounded-2xl! font-body-md font-semibold transition-all shadow-button flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
            type="button"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
                Registrando...
              </>
            ) : (
              <>
                <IonIcon icon={addOutline} className="text-lg" />
                Registrar Producto
              </>
            )}
          </button>
        </div>
      </div>
    </IonModal>
  );
};

export default ScannerRegisterModal;
