import { IonIcon } from '@ionic/react';
import { apertureOutline } from 'ionicons/icons';
import React from 'react';

interface ScannerViewfinderProps {
  hasCameraPermission: boolean | null;
  isFlashEffectActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

/**
 * Pure presentational component for the scanner camera overlay.
 * Renders the video feed, scanning frame with corner brackets,
 * animated laser line, and flash effect.
 */
const ScannerViewfinder: React.FC<ScannerViewfinderProps> = ({hasCameraPermission,isFlashEffectActive,videoRef,}) => {
  return (
    <>
      {/* Video Stream or Fallback */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center">
        {hasCameraPermission ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"/>
        ) : (
          <div className="absolute inset-0 bg-radial from-slate-900 via-slate-950 to-black flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none scanner-camera-fallback-pattern" />
            <IonIcon icon={apertureOutline} className="text-6xl text-outline-variant/20 animate-spin-slow" />
            <p className="font-body-md text-sm text-outline-variant/40 mt-sm">
              Cámara no iniciada (Modo simulación disponible)
            </p>
          </div>
        )}
      </div>

      {/* Flash Effect Overlay */}
      {isFlashEffectActive && (
        <div className="absolute inset-0 bg-white z-40 animate-fade-out pointer-events-none" />
      )}

      {/* Scanning Overlay */}
      <div className="scanner-viewfinder-overlay">
        {/* Top Instructions */}
        <div className="w-full pt-12 pb-6 px-lg bg-linear-to-b from-black/80 to-transparent flex flex-col items-center gap-sm">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            <span className="font-label-caps text-xs text-white/90 tracking-wider uppercase font-semibold">
              Buscando código de barras
            </span>
          </span>
        </div>

        {/* Focus Range — Center Viewfinder */}
        <div className="scanner-viewfinder-range">
          {/* Dimmed background cut-out */}
          <div className="scanner-viewfinder-cutout" />

          {/* Corner Brackets */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-xl" />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-xl" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-xl" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-xl" />

          {/* Animated Laser Line */}
          <div className="absolute left-2 right-2 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent animate-scanner-laser scanner-laser-line-shadow" />
        </div>

        {/* Spacer for bottom controls (handled by parent) */}
        <div />
      </div>
    </>
  );
};

export default ScannerViewfinder;
