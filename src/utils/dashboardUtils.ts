import { Product } from '@/data/productsData';

export interface DashboardMetrics {
  totalStockUnits: number;
  stockAlerts: number;
  valuation: number;
}

/**
 * Calcula de manera optimizada las métricas del inventario para el dashboard en una sola iteración.
 * 
 * @param products Lista de productos de la base de datos
 * @returns Objeto con unidades de stock totales, conteo de alertas de stock y valorización total.
 */
export const calculateDashboardMetrics = (products: Product[]): DashboardMetrics => {
  let totalStockUnits = 0;
  let stockAlerts = 0;
  let valuation = 0;

  for (const p of products) {
    const stock = p.stock ?? 0;
    const price = p.price ?? 0;

    totalStockUnits += stock;
    valuation += stock * price;
    if (stock <= 10) {
      stockAlerts++;
    }
  }

  return {
    totalStockUnits,
    stockAlerts,
    valuation,
  };
};
