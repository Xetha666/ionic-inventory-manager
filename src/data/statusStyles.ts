import { ProductStatus } from './productsData';

export interface StatusStyleDetails {
  bg: string;
  border: string;
  text: string;
}

export const statusStyles: Record<ProductStatus, StatusStyleDetails> = {
  Disponible: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    border: 'border-emerald-500/20 dark:border-emerald-500/30',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  Bajo: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    border: 'border-amber-500/20 dark:border-amber-500/30',
    text: 'text-amber-600 dark:text-amber-400',
  },
  Critico: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    border: 'border-rose-500/20 dark:border-rose-500/30',
    text: 'text-rose-600 dark:text-rose-400',
  },
};
