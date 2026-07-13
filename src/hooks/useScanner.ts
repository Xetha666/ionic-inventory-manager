import { Product } from '@/data/productsData';
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner';
import { useCamera, UseCameraReturn } from '@/hooks/useCamera';
import { productService } from '@/services/productService';
import { FLASH_EFFECT_DURATION_MS, SCAN_RESUME_DELAY_MS } from '@/utils/scannerUtils';
import { useCallback, useState } from 'react';

export interface UseScannerReturn {
  /** Camera state & controls */
  camera: UseCameraReturn;
  /** Scanned barcode string (for the register modal) */
  scannedCode: string;
  /** Whether the white flash overlay should render */
  isFlashEffectActive: boolean;

  // Product modal
  detectedProduct: Product | null;
  isProductModalOpen: boolean;

  // Register modal
  isRegisterModalOpen: boolean;

  // Toast
  toastMessage: string | null;
  dismissToast: () => void;

  // Actions
  handleScan: (code: string) => void;
  handleToggleFlash: () => Promise<void>;
  handleStockUpdated: () => void;
  handleProductCreated: (product: Product) => void;
  resumeScanning: () => void;
}

/**
 * Top-level orchestrator hook for the Scanner page.
 * Composes useCamera + useBarcodeScanner and manages modal/toast state.
 */
export const useScanner = (): UseScannerReturn => {
  // Sub-hooks
  const camera = useCamera();

  // Scan control state (lifted from useBarcodeScanner)
  const [isPaused, setIsPaused] = useState(false);

  // Scan result state
  const [scannedCode, setScannedCode] = useState('');
  const [isFlashEffectActive, setIsFlashEffectActive] = useState(false);

  // Modal state
  const [detectedProduct, setDetectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Successful scan handler — shared between detector and simulator
  const handleScan = useCallback(async (code: string) => {
    if (isPaused) return;
    setIsPaused(true);
    setScannedCode(code);

    // Visual flash effect
    setIsFlashEffectActive(true);
    setTimeout(() => setIsFlashEffectActive(false), FLASH_EFFECT_DURATION_MS);

    try {
      const products = await productService.fetchProducts();
      const matched = products.find((p) => p.id === code);

      if (matched) {
        setDetectedProduct(matched);
        setIsProductModalOpen(true);
      } else {
        setIsRegisterModalOpen(true);
      }
    } catch (err) {
      console.error('Error al procesar lectura de producto:', err);
      setToastMessage('Error al consultar el producto en inventario');
      setIsPaused(false);
    }
  }, [isPaused]);

  // Wire detector to camera + handler
  useBarcodeScanner({
    videoRef: camera.videoRef,
    isCameraReady: camera.hasCameraPermission === true,
    isPaused,
    onDetected: handleScan,
  });

  // Action to toggle camera flash with user toast feedback
  const handleToggleFlash = useCallback(async () => {
    const error = await camera.toggleFlash();
    if (error) {
      setToastMessage(error);
    }
  }, [camera]);

  // Post-save callback
  const handleStockUpdated = () => {
    setToastMessage('Stock guardado correctamente');
  };

  // Post-create callback
  const handleProductCreated = (newProduct: Product) => {
    setIsRegisterModalOpen(false);
    setDetectedProduct(newProduct);
    setIsProductModalOpen(true);
    setToastMessage('Producto creado con éxito');
  };

  // Re-enable scanning after modal closes
  const resumeScanning = () => {
    setIsProductModalOpen(false);
    setIsRegisterModalOpen(false);
    setTimeout(() => setIsPaused(false), SCAN_RESUME_DELAY_MS);
  };

  return {
    camera,
    scannedCode,
    isFlashEffectActive,

    detectedProduct,
    isProductModalOpen,

    isRegisterModalOpen,

    toastMessage,
    dismissToast: () => setToastMessage(null),

    handleScan,
    handleToggleFlash,
    handleStockUpdated,
    handleProductCreated,
    resumeScanning,
  };
};
