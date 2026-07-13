import FormField from '@/components/inventory/FormField';
import { AddProductFormData } from '@/hooks/useAddProduct';
import { IonIcon } from '@ionic/react';
import { alertCircleOutline, checkmarkCircleOutline, cloudUploadOutline, cubeOutline, imageOutline, pricetagOutline, trashOutline, walletOutline } from 'ionicons/icons';
import React from 'react';

interface FormAddProductProps {
  form: AddProductFormData;
  errors: Partial<AddProductFormData>;
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  submitting: boolean;
  submitError: string | null;
  handleFieldChange: (field: keyof AddProductFormData, value: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
}

const FormAddProduct: React.FC<FormAddProductProps> = ({form,errors,imagePreview,fileInputRef,submitting,submitError,handleFieldChange,handleImageChange,removeImage}) => {
  return (
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
              src={imagePreview}
              alt="Previsualización"
              className="w-full h-full object-cover"
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
                Imagen lista
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

      {/* Product ID */}
      <FormField
        id="product-id"
        label="ID del Producto"
        icon={pricetagOutline}
        placeholder=""
        value={form.id}
        disabled={true}
        hint="ID único autogenerado para este producto (solo lectura)"
        onChange={(v) => handleFieldChange('id', v)}
      />

      {/* Product Name */}
      <FormField
        id="product-name"
        label="Nombre del Producto"
        icon={cubeOutline}
        placeholder="Ej: ThinkPad X1 Carbon Gen 10"
        value={form.name}
        error={errors.name}
        onChange={(v) => handleFieldChange('name', v)}
      />

      {/* Category */}
      <FormField
        id="product-category"
        label="Categoría"
        icon={pricetagOutline}
        placeholder="Ej: Laptops, Monitores, Audio..."
        value={form.category}
        error={errors.category}
        onChange={(v) => handleFieldChange('category', v)}
      />

      {/* Initial Stock */}
      <FormField
        id="product-stock"
        label="Stock Inicial"
        icon={cubeOutline}
        placeholder="0"
        value={form.stock}
        error={errors.stock}
        type="number"
        hint="Número de unidades disponibles al crear"
        onChange={(v) => handleFieldChange('stock', v)}
      />

      {/* Precio */}
      <FormField
        id="product-price"
        label="Precio (S/)"
        icon={walletOutline}
        placeholder="0.00"
        value={form.price}
        error={errors.price}
        type="number"
        hint="Precio unitario en Soles (PEN)"
        onChange={(v) => handleFieldChange('price', v)}
      />

      {/* Submit Error */}
      {submitError && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600">
          <IonIcon icon={alertCircleOutline} className="text-lg shrink-0 mt-0.5" />
          <p className="font-body-md text-sm">{submitError}</p>
        </div>
      )}
    </div>
  );
};

export default FormAddProduct;
