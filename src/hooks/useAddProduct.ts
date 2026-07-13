import { Product } from '@/data/productsData';
import { productService } from '@/services/productService';
import { useCallback, useRef, useState } from 'react';

export interface AddProductFormData {
  id: string;
  name: string;
  category: string;
  stock: string;
  price: string;
}

const INITIAL_FORM: AddProductFormData = {
  id: '',
  name: '',
  category: '',
  stock: '',
  price: '',
};

export interface UseAddProductOptions {
  onSuccess: (product: Product) => void;
  /** When provided, openModal uses this value as the product ID instead of a UUID. */
  initialId?: string;
}

export const useAddProduct = ({ onSuccess, initialId }: UseAddProductOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<AddProductFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<AddProductFormData>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = useCallback(() => {
    const productId = initialId ?? crypto.randomUUID();
    setForm({
      id: productId,
      name: '',
      category: '',
      stock: '',
      price: '',
    });
    setErrors({});
    setImageFile(null);
    setImagePreview(null);
    setSubmitError(null);
    setIsOpen(true);
  }, [initialId]);

  const closeModal = useCallback(() => {
    if (submitting) return;
    setIsOpen(false);
  }, [submitting]);

  const handleFieldChange = useCallback((field: keyof AddProductFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const removeImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Partial<AddProductFormData> = {};

    if (!form.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (form.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!form.category.trim()) {
      newErrors.category = 'La categoría es requerida';
    }

    const stockNum = Number(form.stock);
    if (form.stock === '' || isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = 'El número no puede ser negativo';
    }

    const priceNum = Number(form.price);
    if (form.price === '' || isNaN(priceNum) || priceNum < 0) {
      newErrors.price = 'El precio no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    const productId = form.id.trim();
    const stockNum = Number(form.stock);
    const priceNum = Number(form.price);

    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        imageUrl = await productService.uploadProductImage(imageFile, productId);
      }

      const created = await productService.createProduct({
        id: productId,
        name: form.name.trim(),
        category: form.category.trim(),
        stock: stockNum,
        price: priceNum,
        image_url: imageUrl,
      });

      onSuccess(created);
      setIsOpen(false);
    } catch (err) {
      console.error('Error al crear producto:', err);
      const errMsg = err instanceof Error ? err.message : 'Error inesperado al crear el producto';
      setSubmitError(errMsg);
    } finally {
      setSubmitting(false);
    }
  }, [form, imageFile, onSuccess, validate]);

  return {
    isOpen,
    openModal,
    closeModal,
    form,
    errors,
    imagePreview,
    imageFile,
    fileInputRef,
    submitting,
    submitError,
    handleFieldChange,
    handleImageChange,
    removeImage,
    handleSubmit,
  };
};
