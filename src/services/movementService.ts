import { supabase } from './supabaseClient';

export interface ProductMovement {
  id: string;
  product_id: string;
  type: 'in' | 'out';
  quantity: number;
  prev_stock: number;
  new_stock: number;
  created_at: string;
}

export const movementService = {
  /**
   * Obtiene todos los movimientos de stock registrados en los últimos 7 días.
   */
  async fetchWeeklyMovements(): Promise<ProductMovement[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    // Establecer al inicio del día de hace 7 días para no perder ningún registro
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const dateStr = sevenDaysAgo.toISOString();

    const { data, error } = await supabase
      .from('product_movements')
      .select('*')
      .gte('created_at', dateStr)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error al obtener movimientos semanales de Supabase:', error);
      throw new Error(`Error al obtener movimientos semanales`);
    }

    return data || [];
  },
};
export default movementService;
