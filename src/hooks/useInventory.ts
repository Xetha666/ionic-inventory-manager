import { Product, getStatusFromStock } from '@/data/productsData';
import { productService } from '@/services/productService';
import { countActiveFilters, filterProducts, getUniqueCategories, sortProducts } from '@/utils/inventoryFilters';
import { useEffect, useMemo, useState } from 'react';

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('name-asc');

  // Debounce search value to optimize client-side filtering and rendering
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchValue]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [lastCount, setLastCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('inventory_last_product_count');
      return saved ? parseInt(saved, 10) : 6;
    } catch {
      return 6;
    }
  });

  const loadProducts = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await productService.fetchProducts();
      setProducts(data);
      setLastCount(data.length);
      try {
        localStorage.setItem('inventory_last_product_count', String(data.length));
      } catch (e) {
        console.error(e);
      }
    } catch (err: any) {
      console.error('Error al cargar productos de Supabase:', err);
      setError('Error al cargar productos');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Update stock with optimistic updates
  const updateStock = async (id: string, newStock: number) => {
    const previousProducts = [...products];

    // Optimistically update local state immediately
    const updatedStatus = getStatusFromStock(newStock);
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, stock: newStock, status: updatedStatus } : product
      )
    );

    try {
      await productService.updateProductStock(id, newStock);
      // Silent re-fetch to sync database exact state in background
      await loadProducts(true);
    } catch (err: any) {
      // Revert if Supabase call fails
      setProducts(previousProducts);
      throw err;
    }
  };

  // Extract unique categories dynamically from the products list
  const categories = useMemo(() => {
    return getUniqueCategories(products);
  }, [products]);

  // Handle clearing all filters to return to default state
  const handleClearAllFilters = () => {
    setSearchValue('');
    setDebouncedSearchValue('');
    setSelectedSort('name-asc');
    setSelectedStatus('all');
    setSelectedCategory('all');
  };

  // Filter and sort products dynamic logic
  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(products, {
      searchValue: debouncedSearchValue,
      selectedStatus,
      selectedCategory,
    });
    return sortProducts(filtered, selectedSort);
  }, [products, debouncedSearchValue, selectedSort, selectedStatus, selectedCategory]);

  // Compute active filters count
  const activeFiltersCount = useMemo(() => {
    return countActiveFilters(selectedSort, selectedStatus, selectedCategory);
  }, [selectedSort, selectedStatus, selectedCategory]);

  // Construct structured props for the header component
  const headerProps = {
    searchValue,
    onSearchChange: setSearchValue,
    onFilterClick: () => setIsFilterModalOpen(true),
    activeFiltersCount,
  };

  // Construct structured props for the filter modal component
  const filterModalProps = {
    isOpen: isFilterModalOpen,
    onClose: () => setIsFilterModalOpen(false),
    selectedSort,
    onSortChange: setSelectedSort,
    selectedStatus,
    onStatusChange: setSelectedStatus,
    selectedCategory,
    onCategoryChange: setSelectedCategory,
    categories,
    onClearAll: handleClearAllFilters,
  };

  // Optimistically add a newly created product to the top of the list
  const addProduct = async (product: Product) => {
    setProducts((prev) => {
      const updated = [product, ...prev];
      setLastCount(updated.length);
      try {
        localStorage.setItem('inventory_last_product_count', String(updated.length));
      } catch {}
      return updated;
    });
    // Silent re-fetch to sync database exact state in background
    await loadProducts(true);
  };

  // Optimistically edit an existing product
  const editProduct = async (originalId: string, updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === originalId ? updatedProduct : p))
    );
    // Silent re-fetch to sync database exact state in background
    await loadProducts(true);
  };

  // Optimistically delete a product
  const deleteProduct = async (id: string, imageUrl?: string | null) => {
    const previousProducts = [...products];

    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      setLastCount(updated.length);
      try {
        localStorage.setItem('inventory_last_product_count', String(updated.length));
      } catch {}
      return updated;
    });

    try {
      await productService.deleteProduct(id, imageUrl);
      await loadProducts(true);
    } catch (err: any) {
      setProducts(previousProducts);
      throw err;
    }
  };

  return {
    products,
    filteredProducts,
    totalCount: products.length,
    filteredCount: filteredProducts.length,
    lastCount,
    loading,
    error,
    updateStock,
    addProduct,
    editProduct,
    deleteProduct,
    retryFetch: () => loadProducts(false),
    headerProps,
    filterModalProps,
    clearAllFilters: handleClearAllFilters,
  };
};

