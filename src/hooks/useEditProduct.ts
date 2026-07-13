import { Product } from '@/data/productsData';
import { productService } from '@/services/productService';
import { useEffect, useRef, useState } from 'react';

export interface EditProductFormData {
  id: string;
  name: string;
  category: string;
  price: string;
}

export interface UseEditProductOptions {
  product: Product | null;
  onSuccess: (originalId: string, product: Product) => void;
  onClose: () => void;
}

export const useEditProduct = ({ product, onSuccess, onClose }: UseEditProductOptions) => {
  const [form, setForm] = useState<EditProductFormData>({ id: '', name: '', category: '', price: '' });
  const [errors, setErrors] = useState<Partial<EditProductFormData>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when product changes (e.g. modal opens)
  useEffect(() => {
    if (product) {
      setForm({
        id: product.id,
        name: product.name,
        category: product.category,
        price: String(product.price ?? 0),
      });
      setImagePreview(product.image_url || null);
      setImageFile(null);
      setErrors({});
      setSubmitError(null);
    }
  }, [product]);

  const handleFieldChange = (field: keyof EditProductFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = (): boolean => {
    const newErrors: Partial<EditProductFormData> = {};

    if (!form.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!form.category.trim()) {
      newErrors.category = 'La categoría es requerida';
    }

    const priceNum = Number(form.price);
    if (form.price === '' || isNaN(priceNum) || priceNum < 0) {
      newErrors.price = 'El precio no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!product || !validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      let imageUrl: string | null | undefined = product.image_url;

      if (imageFile) {
        // Eliminar la imagen anterior del storage si existía para evitar acumular archivos
        if (product.image_url) {
          await productService.deleteImageFromStorage(product.image_url);
        }
        // Nueva imagen seleccionada → subir y reemplazar
        imageUrl = await productService.uploadProductImage(imageFile, product.id);
      } else if (imagePreview === null && product.image_url) {
        // Imagen eliminada por el usuario → borrar del storage y limpiar URL
        await productService.deleteImageFromStorage(product.image_url);
        imageUrl = null;
      }

      const priceNum = Number(form.price);

      const updated = await productService.updateProduct(product.id, {
        name: form.name.trim(),
        category: form.category.trim(),
        price: priceNum,
        // Guardar siempre la URL limpia (sin el ?t= timestamp) o null si se eliminó
        image_url: imageUrl ? imageUrl.split('?')[0] : imageUrl,
      });

      onSuccess(product.id, updated);
      onClose();
    } catch (err: any) {
      console.error('Error al editar producto:', err);
      setSubmitError(err?.message ?? 'Error inesperado al actualizar el producto');
    } finally {
      setSubmitting(false);
    }
  };

  const isDirty = product ? (
    form.name.trim() !== product.name ||
    form.category.trim() !== product.category ||
    String(form.price).trim() !== String(product.price ?? 0) ||
    imagePreview !== (product.image_url || null)
  ) : false;

  return {
    form,
    errors,
    imagePreview,
    fileInputRef,
    submitting,
    submitError,
    handleFieldChange,
    handleImageChange,
    removeImage,
    handleSubmit,
    isDirty,
  };
};
