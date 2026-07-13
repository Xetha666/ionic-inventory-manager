import AddProductModal from '@/components/inventory/AddProductModal';
import EditProductModal from '@/components/inventory/EditProductModal';
import InventoryEmptyState from '@/components/inventory/InventoryEmptyState';
import InventoryFilterModal from '@/components/inventory/InventoryFilterModal';
import InventoryHeader from '@/components/inventory/InventoryHeader';
import ProductCard from '@/components/inventory/ProductCard';
import ProductSkeleton from '@/components/inventory/ProductSkeleton';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import { Product } from '@/data/productsData';
import { useInventory } from '@/hooks/useInventory';
import { useProductOptions } from '@/hooks/useProductOptions';
import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';

const Inventory: React.FC = () => {
  const { filteredProducts, totalCount, filteredCount, lastCount, loading, error, updateStock, addProduct, editProduct, deleteProduct, retryFetch, headerProps, filterModalProps, clearAllFilters } = useInventory();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { openProductMenu } = useProductOptions({
    updateStock,
    onEditProduct: (p) => setEditingProduct(p),
    onDeleteProduct: async (id, imageUrl) => {
      await deleteProduct(id, imageUrl);
    },
  });

  return (
    <IonPage>
      {/* Dynamic Search & Filter Header */}
      <InventoryHeader headerProps={headerProps} />

      <IonContent scrollY={true}>
        <main className="px-container-padding pt-md pb-bottom-nav-safe flex flex-col gap-lg bg-surface min-h-full">
          {/* Section Header */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="font-h2 text-h2 text-on-background font-bold">
                Catálogo de Productos
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant">
                {loading ? 'Cargando inventario...' : `Mostrando ${filteredCount} de ${totalCount} productos`}
              </p>
            </div>
          </div>

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-xl px-md gap-md text-center bg-surface-container-low rounded-2xl border border-outline-variant/30">
              <p className="text-rose-500 font-semibold">{error}</p>
              <button 
                onClick={retryFetch}
                className="px-lg py-sm bg-primary text-on-primary rounded-xl font-semibold active:scale-95 transition-all cursor-pointer hover:bg-primary-tint"
                type="button">
                Reintentar
              </button>
            </div>
          )}

          {/* Bento-style Product Grid */}
          {!error && (
            loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                {/* Recuperamos la cantidad exacta para el loader skeleton y utilizamos localstorage */}
                {Array.from({ length: filteredCount > 0 ? filteredCount : (totalCount > 0 ? totalCount : lastCount) }).map((_, idx) => (
                  <ProductSkeleton key={idx} />
                ))}
              </div>
            ) : filteredCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onMenuClick={openProductMenu} 
                  />
                ))}
              </div>
            ) : (<InventoryEmptyState onClearFilters={clearAllFilters} totalCount={totalCount} />)
          )}
        </main>
      </IonContent>

      {/* Add Product Modal (includes its own FAB trigger) */}
      <AddProductModal onProductAdded={addProduct} />

      {/* Edit Product Modal */}
      <EditProductModal
        product={editingProduct}
        isOpen={editingProduct !== null}
        onClose={() => setEditingProduct(null)}
        onProductUpdated={editProduct}
      />

      {/* Bottom Navigation Menu */}
      <BottomNavBar activePath="/inventory" />

      {/* Sheet Filter Modal */}
      <InventoryFilterModal filterModalProps={filterModalProps} />
    </IonPage>
  );
};

export default Inventory;
