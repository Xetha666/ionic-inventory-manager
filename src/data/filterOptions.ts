export interface FilterOption {
  value: string;
  label: string;
}

export const sortOptions: FilterOption[] = [
  { value: 'name-asc', label: 'Nombre: A a Z' },
  { value: 'name-desc', label: 'Nombre: Z a A' },
  { value: 'stock-desc', label: 'Stock: Mayor a Menor' },
  { value: 'stock-asc', label: 'Stock: Menor a Mayor' },
  { value: 'price-asc', label: 'Precio: Menor a Mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a Menor' },
  { value: 'id-asc', label: 'ID: A a Z' },
];

export const statusOptions: FilterOption[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'Disponible', label: 'Disponible' },
  { value: 'Bajo', label: 'Bajo Stock' },
  { value: 'Critico', label: 'Critico' },
];

export const getCategoryOptions = (categories: string[]): FilterOption[] => [
  { value: 'all', label: 'Todas las categorías' },
  ...categories.map((cat) => ({ value: cat, label: cat })),
];
