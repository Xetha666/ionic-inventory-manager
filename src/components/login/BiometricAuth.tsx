import { IonIcon, isPlatform } from '@ionic/react';
import { fingerPrintOutline, personCircleOutline } from 'ionicons/icons';
import React from 'react';

interface BiometricAuthProps {
  onFingerprintClick?: () => void;
  onFaceIdClick?: () => void;
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({ 
  onFingerprintClick, 
  onFaceIdClick 
}) => {
  const isIos = isPlatform('ios');
  const isAndroid = isPlatform('android');

  // Mostrar huella en Android, Face ID en iOS.
  // En desarrollo en navegador, mostrar ambos para pruebas.
  const showFingerprint = isAndroid || (!isIos && !isAndroid);
  const showFaceId = isIos || (!isIos && !isAndroid);

  const typeBiometric = isIos ? 'Face ID' : isAndroid ? 'Huella' : '';

  return (
    <div className="mt-md sm:mt-xl pt-md sm:pt-lg border-t border-outline-variant/30 flex flex-col items-center gap-sm sm:gap-md relative z-10">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
        O ingresa con {typeBiometric}
      </span>
      <div className="flex gap-md sm:gap-lg">
        {/* Fingerprint Button */}
        {showFingerprint && (
          <button 
            aria-label="Usar huella dactilar" 
            className="size-14 rounded-card-lg border border-outline-variant/50 bg-surface flex items-center justify-center text-secondary hover:bg-surface-container hover:text-primary hover:border-primary/30 active:scale-95 transition-all shadow-sm cursor-pointer" 
            type="button"
            onClick={onFingerprintClick}
          >
            <IonIcon 
              icon={fingerPrintOutline} 
              className="text-3xl" 
            />
          </button>
        )}

        {/* Face ID Button */}
        {showFaceId && (
          <button 
            aria-label="Usar cuenta" 
            className="size-14 rounded-card-lg border border-outline-variant/50 bg-surface flex items-center justify-center text-secondary hover:bg-surface-container hover:text-primary hover:border-primary/30 active:scale-95 transition-all shadow-sm cursor-pointer" 
            type="button"
            onClick={onFaceIdClick}
          >
            <IonIcon 
              icon={personCircleOutline} 
              className="text-3xl" 
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default BiometricAuth;
