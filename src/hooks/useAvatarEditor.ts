import { getCroppedImg } from '@/utils/cropImage';
import React, { useCallback, useRef, useState } from 'react';

export const useAvatarEditor = (onAvatarChange?: (newAvatarUrl: string) => void) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        if (onAvatarChange) {
          onAvatarChange(croppedImage);
        }
        setImageSrc(null);
      } catch (err) {
        console.error('Error cropping image:', err);
      }
    }
  };

  const handleCancel = () => {
    setImageSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input to allow selecting same file
    }
  };

  return {
    fileInputRef,
    imageSrc,
    crop,
    zoom,
    setCrop,
    setZoom,
    handleAvatarClick,
    handleFileChange,
    onCropComplete,
    handleSave,
    handleCancel,
  };
};
