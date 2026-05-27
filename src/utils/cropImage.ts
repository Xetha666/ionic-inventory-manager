/**
 * Helper to crop an image using HTML5 Canvas and export as a Base64 PNG.
 */
export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('No 2d context'));
        return;
      }

      // Set canvas size to the cropped area size
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // Draw the cropped portion of the image onto the canvas
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // Convert to Base64 data URL (WebP format for optimized compression)
      const base64Image = canvas.toDataURL('image/webp', 0.85);
      resolve(base64Image);
    };
    image.onerror = (error) => reject(error);
  });
};
