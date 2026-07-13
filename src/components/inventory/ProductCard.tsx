import { Product } from '@/data/productsData';
import { statusStyles } from '@/data/statusStyles';
import { IonIcon } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';

interface ProductCardProps {
  product: Product;
  onMenuClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onMenuClick }) => {
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [product.image_url]);

  const imgSrc = !hasImageError && product.image_url ? product.image_url : '/placeholder.webp';

  const handleImageError = () => {
    setHasImageError(true);
  };

  const currentStatusStyle = statusStyles[product.status] || statusStyles.Disponible;

  const formattedPrice = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(product.price ?? 0);

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-md flex flex-col gap-md shadow-card hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.99]">
      <div className="flex gap-md">
        {/* Product Image */}
        <div className="w-16 h-16 rounded-xl bg-surface-variant overflow-hidden shrink-0 border border-outline-variant/20 flex items-center justify-center">
          <img
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300"
            src={imgSrc}
            onError={handleImageError}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-xs">
            <h3 className="font-data-tabular text-data-tabular text-on-surface truncate pr-2 font-semibold">
              {product.name}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onMenuClick) onMenuClick(product);
              }}
              className="text-outline hover:text-primary transition-colors shrink-0 -mt-1 -mr-1 p-1 rounded-full hover:bg-surface-container-low cursor-pointer flex items-center justify-center"
              type="button"
              aria-label="Más opciones"
            >
              <IonIcon icon={ellipsisVertical} className="text-lg" />
            </button>
          </div>
          <p className="font-body-md text-xs text-on-surface-variant mt-1">
            ID: {product.id}
          </p>
        </div>
      </div>

      {/* Stock and Status Badge */}
      <div className="flex items-center justify-between border-t border-outline-variant/30 pt-sm mt-auto">
        <div className="flex flex-col">
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
            Stock
          </span>
          <span className="font-data-tabular text-body-md font-medium text-on-surface">
            {product.stock} unidades
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
            Precio
          </span>
          <span className="font-data-tabular text-body-md font-semibold text-primary">
            {formattedPrice}
          </span>
        </div>

        <div
          className={`h-6 px-2.5 rounded-full ${currentStatusStyle.bg} ${currentStatusStyle.border} ${currentStatusStyle.text} border flex items-center justify-center`}
        >
          <span className="font-label-caps text-sm font-bold tracking-wider uppercase">
            {product.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
