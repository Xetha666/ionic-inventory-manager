import { Product } from '@/data/productsData';

export interface FilterOptions {
  searchValue: string;
  selectedStatus: string;
  selectedCategory: string;
}

/**
 * Filters a list of products based on search value, status, and category.
 */
export const filterProducts = (products: Product[], options: FilterOptions): Product[] => {
  let result = [...products];
  const { searchValue, selectedStatus, selectedCategory } = options;

  // 1. Text Search (by name or ID)
  if (searchValue) {
    const query = searchValue.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query)
    );
  }

  // 2. Filtro de Estado de Stock
  // Si el estado seleccionado no es 'all' (Todos los estados), conservamos únicamente
  // result = lo que hay en db | selectStatus = input del usuario
  if (selectedStatus !== 'all') {
    result = result.filter((p) => p.status === selectedStatus);
  }

  // 3. Filtro de Categoría
  // Si la categoría seleccionada no es 'all' (Todas las categorías), filtramos la lista
  if (selectedCategory !== 'all') {
    result = result.filter((p) => p.category === selectedCategory);
  }

  return result;
};

/**
 * Ordena una lista de productos según el criterio proporcionado (sortKey).
 * 
 * Ejemplo de entrada:
 *   const productos = [
 *     { id: 'LPT-TPX1-0042', name: 'ThinkPad X1 Carbon Gen 10', stock: 142 },
 *     { id: 'ACC-PS5C-8819', name: 'DualSense Wireless Controller', stock: 3 }
 *   ];
 * 
 * Resultados según 'sortKey':
 *   - 'name-asc'   => ['DualSense Wireless Controller', 'ThinkPad X1 Carbon Gen 10'] (D < T, alfabético de A a Z)
 *   - 'name-desc'  => ['ThinkPad X1 Carbon Gen 10', 'DualSense Wireless Controller'] (alfabético de Z a A)
 *   - 'stock-desc' => ['ThinkPad X1 Carbon Gen 10' (142), 'DualSense Wireless Controller' (3)] (mayor stock primero)
 *   - 'stock-asc'  => ['DualSense Wireless Controller' (3), 'ThinkPad X1 Carbon Gen 10' (142)] (menor stock primero)
 *   - 'id-asc'     => ['DualSense Wireless Controller' (ACC-PS5C-8819), 'ThinkPad X1 Carbon Gen 10' (LPT-TPX1-0042)] (A < L, alfabético de ID de A a Z)
 */
export const sortProducts = (products: Product[], sortKey: string): Product[] => {
  const result = [...products];

  result.sort((a, b) => {
    switch (sortKey) {
      case 'name-asc': {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      }
      case 'name-desc': {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
      }
      case 'stock-desc':
        return b.stock - a.stock;
      case 'stock-asc':
        return a.stock - b.stock;
      case 'price-desc':
        return b.price - a.price;
      case 'price-asc':
        return a.price - b.price;
      case 'id-asc':
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      default:
        return 0;
    }
  });

  return result;
};

/**
 * Extracts unique non-empty categories from the products list.
 * Los set son objetos que no permiten duplicados.
 */
export const getUniqueCategories = (products: Product[]): string[] => {
  const allCategories = products.map((product) => product.category);
  return Array.from(new Set(allCategories)).filter(Boolean);
};

/**
 * Computes active filters count.
 */
export const countActiveFilters = (sortKey: string, selectedStatus: string, selectedCategory: string): number => {
  let count = 0;
  if (sortKey !== 'name-asc') count++;
  if (selectedStatus !== 'all') count++;
  if (selectedCategory !== 'all') count++;
  return count;
};
