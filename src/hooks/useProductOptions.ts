import { Product } from '@/data/productsData';
import { useIonActionSheet, useIonAlert } from '@ionic/react';
import { closeOutline, pencilOutline, trashOutline, trendingUpOutline } from 'ionicons/icons';

interface UseProductOptionsProps {
  updateStock: (id: string, newStock: number) => Promise<void>;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string, imageUrl?: string | null) => Promise<void>;
}

export const useProductOptions = ({
  updateStock,
  onEditProduct,
  onDeleteProduct,
}: UseProductOptionsProps) => {
  const [presentActionSheet] = useIonActionSheet();
  const [presentAlert] = useIonAlert();

  const handleAdjustStock = async (product: Product, newStock: number) => {
    try {
      await updateStock(product.id, newStock);
    } catch (err: any) {
      console.error('Error al actualizar el stock en la base de datos:', err);
      presentAlert({
        header: 'Error al actualizar',
        message: 'No se pudo guardar el cambio de stock en el servidor. El cambio local ha sido revertido.',
        buttons: ['OK'],
      });
    }
  };

  const handleDeleteConfirm = (product: Product) => {
    presentAlert({
      header: '¿Eliminar producto?',
      message: `Esta acción es permanente y eliminará el producto "${product.name}" y su imagen asociada. ¿Deseas continuar?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await onDeleteProduct(product.id, product.image_url);
            } catch (err: any) {
              console.error('Error al eliminar producto:', err);
              presentAlert({
                header: 'Error al eliminar',
                message: err?.message ?? 'Ocurrió un error inesperado al intentar eliminar el producto.',
                buttons: ['OK'],
              });
            }
          },
        },
      ],
    });
  };

  const openProductMenu = (product: Product) => {
    presentActionSheet({
      header: product.name,
      subHeader: `ID: ${product.id}`,
      buttons: [
        {
          text: 'Editar Producto',
          icon: pencilOutline,
          handler: () => {
            onEditProduct(product);
          },
        },
        {
          text: 'Ajustar Stock...',
          icon: trendingUpOutline,
          handler: () => {
            presentAlert({
              header: 'Cantidad de Stock',
              subHeader: product.name,
              inputs: [
                {
                  name: 'stock',
                  type: 'number',
                  placeholder: 'Ej. 15',
                  value: product.stock.toString(),
                },
              ],
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                },
                {
                  text: 'Guardar',
                  handler: (data) => {
                    // 10 porque es el sistema decimal
                    const newStock = parseInt(data.stock, 10);
                    if (!isNaN(newStock) && newStock >= 0) {
                      handleAdjustStock(product, newStock);
                    } else {
                      setTimeout(() => {
                        presentAlert({
                          header: 'Valor inválido',
                          message: 'Por favor, ingrese un número entero mayor o igual a 0.',
                          buttons: ['OK'],
                        });
                      }, 150);
                    }
                  },
                },
              ],
            });
          },
        },
        {
          text: 'Eliminar Producto',
          role: 'destructive',
          icon: trashOutline,
          handler: () => {
            handleDeleteConfirm(product);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: closeOutline,
        },
      ],
    });
  };

  return {
    openProductMenu,
  };
};
