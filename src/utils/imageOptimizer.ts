/**
 * Optimiza una imagen en el cliente realizando un recorte cuadrado centrado automático
 * y redimensionándola a una dimensión fija en formato WebP con compresión.
 * 
 * @param file Archivo de imagen original
 * @param targetSize Dimensión final del cuadrado (ancho y alto en px)
 * @param quality Calidad de compresión WebP (0.0 a 1.0)
 * @returns Promesa con el Blob de la imagen WebP optimizada
 */
export const optimizeAndConvertToWebP = (
  file: File,
  targetSize = 300,
  quality = 0.75
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      // Liberar memoria del object URL inmediatamente
      URL.revokeObjectURL(url);

      // Encontrar la dimensión mínima para el recorte cuadrado centrado
      const sourceSize = Math.min(img.width, img.height);
      const sx = (img.width - sourceSize) / 2;
      const sy = (img.height - sourceSize) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo obtener el contexto de canvas 2D'));
        return;
      }

      // Suavizado de alta calidad al redimensionar
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Dibujar el recorte cuadrado centrado y escalarlo a targetSize x targetSize
      ctx.drawImage(
        img,
        sx,
        sy,
        sourceSize,
        sourceSize,
        0,
        0,
        targetSize,
        targetSize
      );

      // Intentar exportar a WebP
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            // Si falla WebP, intentar fallback con JPEG
            canvas.toBlob(
              (jpegBlob) => {
                if (jpegBlob) {
                  resolve(jpegBlob);
                } else {
                  reject(new Error('No se pudo convertir canvas a Blob'));
                }
              },
              'image/jpeg',
              quality
            );
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Error al cargar la imagen en memoria'));
    };

    img.src = url;
  });
};
