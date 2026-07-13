import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  hasCameraPermission: boolean | null;
  cameraError: string | null;
  isFlashOn: boolean;
  startCamera: () => Promise<void>;
  toggleFlash: () => Promise<string | null>;
}

/**
 * Encapsulates the camera stream lifecycle and torch control.
 * Returns a ref to attach to a <video> element and imperative helpers.
 */
export const useCamera = (): UseCameraReturn => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    stopStream();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      setHasCameraPermission(false);
      
      const errorName = err instanceof Error ? err.name : '';
      setCameraError(
        errorName === 'NotAllowedError'
          ? 'Permiso de cámara denegado'
          : 'No se pudo acceder a la cámara'
      );
    }
  }, [stopStream]);

  /**
   * Toggle the torch/flash light.
   * @returns An error message string if torch is not supported, null otherwise.
   */
  const toggleFlash = useCallback(async (): Promise<string | null> => {
    const stream = streamRef.current;
    if (!stream) return null;

    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };

    if (!capabilities.torch) {
      return 'Flash no soportado en este dispositivo/navegador';
    }

    try {
      await track.applyConstraints({
        advanced: [{ torch: !isFlashOn } as MediaTrackConstraintSet & { torch?: boolean }],
      });
      setIsFlashOn((prev) => !prev);
    } catch (err) {
      console.error('Error al alternar flash:', err);
    }

    return null;
  }, [isFlashOn]);

  // Auto-start camera on mount, cleanup on unmount
  useEffect(() => {
    startCamera();
    return () => stopStream();
  }, [startCamera, stopStream]);

  return {
    videoRef,
    hasCameraPermission,
    cameraError,
    isFlashOn,
    startCamera,
    toggleFlash,
  };
};
