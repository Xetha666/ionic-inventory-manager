import { ProductMovement } from '@/services/movementService';

export interface ChartItem {
  day: string;
  value: number;
}

export interface TrailingDay {
  dateStr: string;
  day: string;
  value: number;
}

/**
 * Genera una lista de los últimos 7 días móviles con sus nombres abreviados en español
 * y valores inicializados en 0.
 */
export const getTrailing7Days = (): TrailingDay[] => {
  const dayNames = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const result: TrailingDay[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push({
      dateStr: d.toDateString(),
      day: dayNames[d.getDay()],
      value: 0,
    });
  }
  
  return result;
};

/**
 * Agrupa los movimientos de stock por día y calcula el volumen total acumulado por día.
 */
export const aggregateMovementsByDay = (movements: ProductMovement[]): ChartItem[] => {
  const trailingDays = getTrailing7Days();
  
  movements.forEach((movement) => {
    const moveDateStr = new Date(movement.created_at).toDateString();
    const matchDay = trailingDays.find((d) => d.dateStr === moveDateStr);
    if (matchDay) {
      matchDay.value += Math.abs(movement.quantity);
    }
  });
  
  return trailingDays.map((d) => ({
    day: d.day,
    value: d.value,
  }));
};
