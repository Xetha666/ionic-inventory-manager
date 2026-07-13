import { Product, getStatusFromStock } from '@/data/productsData';
import { optimizeAndConvertToWebP } from '@/utils/imageOptimizer';
import { supabase } from './supabaseClient';

export const productService = {
  /**
   * Obtiene todos los productos de Supabase y calcula dinámicamente su estado de stock.
   */
  async fetchProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching products from Supabase:', error);
      throw new Error('Error al obtener productos');
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      stock: item.stock,
      price: item.price,
      category: item.category,
      image_url: item.image_url,
      status: getStatusFromStock(item.stock),
    }));
  },

  /**
   * Actualiza el stock de un producto específico en Supabase.
   */
  async updateProductStock(id: string, newStock: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', id);

    if (error) {
      console.error('Error updating product stock in Supabase:', error);
      throw new Error('Error al actualizar el stock');
    }
  },

  /**
   * Sube una imagen de producto al bucket 'products' de Supabase Storage
   * y devuelve su URL pública.
   */
  async uploadProductImage(file: File, productId: string): Promise<string> {
    let uploadPayload: File | Blob = file;
    let ext = file.name.split('.').pop() ?? 'webp';

    // Optimización de imágenes en cliente (conversión a WebP y compresión)
    if (file.type.startsWith('image/')) {
      try {
        const optimizedBlob = await optimizeAndConvertToWebP(file);
        uploadPayload = optimizedBlob;
        const actualMime = optimizedBlob.type; // 'image/webp' o 'image/jpeg'
        ext = actualMime.split('/').pop() ?? 'webp';
      } catch (err) {
        console.error('Fallo la optimización de imagen:', err);
        throw new Error('No se pudo optimizar la imagen');
      }
    }

    const filePath = `${productId}/image_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, uploadPayload, {
        contentType: uploadPayload instanceof Blob ? uploadPayload.type : file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading product image:', uploadError);
      throw new Error('No se pudo subir la imagen');
    }

    const { data } = supabase.storage.from('products').getPublicUrl(filePath);
    if (!data?.publicUrl) {
      console.error('Error getting product image URL:', data);
      throw new Error('No se pudo obtener la imagen');
    }

    return data.publicUrl;
  },

  /**
   * Crea un nuevo producto en Supabase.
   */
  async createProduct(product: Omit<Product, 'status'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error('Error creating product in Supabase:', error);
      throw new Error('Error al crear el producto');
    }

    return {
      ...data,
      status: getStatusFromStock(data.stock),
    };
  },

  /**
   * Actualiza un producto existente en Supabase.
   */
  async updateProduct(id: string, updates: Partial<Omit<Product, 'status'>>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product in Supabase:', error);
      throw new Error('Error al actualizar el producto');
    }

    return {
      ...data,
      status: getStatusFromStock(data.stock),
    };
  },

  /**
   * Elimina solo la imagen de un producto del Storage sin borrar el producto.
   */
  async deleteImageFromStorage(imageUrl: string): Promise<void> {
    try {
      const parts = imageUrl.split('/products/');
      if (parts.length > 1) {
        const filePath = parts[1].split('?')[0];
        const { error: storageError } = await supabase.storage
          .from('products')
          .remove([filePath]);

        if (storageError) {
          console.error('Error deleting image from storage:', storageError);
        }
      }
    } catch (err) {
      console.error('Error parsing image url for deletion:', err);
    }
  },

  /**
   * Elimina un producto de Supabase y su imagen asociada en Storage si existe.
   */
  async deleteProduct(id: string, imageUrl?: string | null): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product from Supabase:', error);
      throw new Error('Error al eliminar el producto de la base de datos');
    }

    if (imageUrl) {
      try {
        const parts = imageUrl.split('/products/');
        if (parts.length > 1) {
          const filePath = parts[1].split('?')[0];
          const { error: storageError } = await supabase.storage
            .from('products')
            .remove([filePath]);

          if (storageError) {
            console.error('Error deleting image from storage:', storageError);
          }
        }
      } catch (err) {
        console.error('Error parsing image url for deletion:', err);
        throw new Error('Error al eliminar la imagen')
      }
    }
  },
};
