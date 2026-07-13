import { Product, getStatusFromStock } from '@/data/productsData';
import { productService } from '@/services/productService';
import { useEffect, useState } from 'react';

export interface UseScannerStockOptions {
  product: Product | null;
  onSaved: () => void;
  onClose: () => void;
}

export interface UseScannerStockReturn {
  stock: number;
  currentStatus: ReturnType<typeof getStatusFromStock>;
  hasChanges: boolean;
  saving: boolean;
  saveError: string | null;
  showSuccessToast: boolean;
  increment: () => void;
  decrement: () => void;
  save: () => Promise<void>;
}

/**
 * Manages the stock stepper state and the save-to-Supabase flow
 * for the ScannerProductModal.
 */
export const useScannerStock = ({product,onSaved,onClose,}: UseScannerStockOptions): UseScannerStockReturn => {
  const [stock, setStock] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Reset state when a new product arrives
  useEffect(() => {
    if (product) {
      setStock(product.stock);
      setSaveError(null);
      setSaving(false);
      setShowSuccessToast(false);
    }
  }, [product]);

  const currentStatus = getStatusFromStock(stock);
  const hasChanges = product !== null && product.stock !== stock;

  const increment = () => setStock((prev) => prev + 1);
  const decrement = () => setStock((prev) => (prev > 0 ? prev - 1 : 0));

  const save = async () => {
    if (!product || !hasChanges) return;

    setSaving(true);
    setSaveError(null);

    try {
      await productService.updateProductStock(product.id, stock);
      onSaved();
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Error al guardar stock desde escáner:', err);
      const errMsg = err instanceof Error ? err.message : 'Error inesperado al guardar stock desde escáner';
      setSaveError(errMsg);
      setSaving(false);
    }
  };

  return {
    stock,
    currentStatus,
    hasChanges,
    saving,
    saveError,
    showSuccessToast,
    increment,
    decrement,
    save,
  };
};
