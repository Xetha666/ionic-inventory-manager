/**
 * Scanner Utility Functions & Constants
 * Pure functions and static data for the scanner feature.
 */

/** Barcode formats supported by the native BarcodeDetector API. */
export const BARCODE_FORMATS = [
  'ean_13',
  'ean_8',
  'qr_code',
  'code_128',
  'code_39',
  'upc_a',
  'upc_e',
] as const;

/** Delay (ms) after closing a modal before re-enabling the scan loop. */
export const SCAN_RESUME_DELAY_MS = 800;

/** Duration (ms) of the white flash overlay on successful scan. */
export const FLASH_EFFECT_DURATION_MS = 200;

/** Format a numeric price as Peruvian Soles (PEN). */
export const formatPricePEN = (price: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(price);
};
