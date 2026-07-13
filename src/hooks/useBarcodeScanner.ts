import { BARCODE_FORMATS } from '@/utils/scannerUtils';
import type { BarcodeDetector as BarcodeDetectorType } from 'barcode-detector';
import { useEffect, useRef, useState } from 'react';

export interface UseBarcodeScannerOptions {
  /** Ref to the video element feeding the detector. */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** Whether the camera stream is ready. */
  isCameraReady: boolean;
  /** Whether scanning is currently paused by the orchestrator. */
  isPaused: boolean;
  /** Callback invoked with the raw barcode value on detection. */
  onDetected: (code: string) => void;
}

export interface UseBarcodeScannerReturn {
  isBarcodeSupported: boolean;
}

/**
 * Runs a requestAnimationFrame loop using the best available BarcodeDetector implementation.
 *
 * It checks if the native browser BarcodeDetector is fully supported (including EAN-13 support,
 * which is missing natively in Chrome on Windows). If not supported, it lazy-loads a high-performance
 * ZXing-C++ WASM polyfill.
 */
export const useBarcodeScanner = ({
  videoRef,
  isCameraReady,
  isPaused,
  onDetected,
}: UseBarcodeScannerOptions): UseBarcodeScannerReturn => {
  const [isBarcodeSupported] = useState(true);
  const scanLoopRef = useRef<number | null>(null);

  // Main scan loop
  useEffect(() => {
    if (!isCameraReady || isPaused) return;

    let active = true;
    let detector: BarcodeDetectorType | null = null;

    const initDetectorAndScan = async () => {
      let DetectorClass: typeof BarcodeDetectorType | undefined = (
        window as unknown as { BarcodeDetector: typeof BarcodeDetectorType }
      ).BarcodeDetector;
      let isNativeWorking = false;

      // Chrome on Windows exposes BarcodeDetector, but getSupportedFormats() is empty.
      if (DetectorClass) {
        try {
          const formats = await DetectorClass.getSupportedFormats();
          if (formats && formats.includes('ean_13')) {
            isNativeWorking = true;
          }
        } catch {
          // Fall back to polyfill on error
        }
      }

      if (!isNativeWorking) {
        try {
          const mod = await import('barcode-detector');
          DetectorClass = mod.BarcodeDetector;
        } catch (err) {
          console.error('No se pudo cargar el polyfill de BarcodeDetector:', err);
          return;
        }
      }

      if (!active || !DetectorClass) return;

      try {
        detector = new DetectorClass({
          formats: [...BARCODE_FORMATS],
        });
      } catch (err) {
        console.error('Error al instanciar el detector de código de barras:', err);
        return;
      }

      const scanFrame = async () => {
        if (!active || isPaused || !videoRef.current) return;

        try {
          // Only attempt detection if the video frame is ready
          if (videoRef.current.readyState >= 2) {
            if (!detector) {
              console.error('Detector de código de barras no inicializado');
              return;
            }
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0 && active && !isPaused) {
              onDetected(barcodes[0].rawValue);
              return; // Stop the loop on successful detection
            }
          }
        } catch {
          // Individual frame failures are expected and ignored (e.g. video transient state)
        }

        if (active && !isPaused) {
          scanLoopRef.current = requestAnimationFrame(scanFrame);
        }
      };

      scanLoopRef.current = requestAnimationFrame(scanFrame);
    };

    initDetectorAndScan();

    return () => {
      active = false;
      if (scanLoopRef.current) {
        cancelAnimationFrame(scanLoopRef.current);
      }
    };
  }, [isCameraReady, isPaused, onDetected, videoRef]);

  return {
    isBarcodeSupported,
  };
};
