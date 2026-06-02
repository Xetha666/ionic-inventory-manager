import { hasStoredBiometricCredentials } from '@/services/biometricService';
import { IonIcon, isPlatform } from '@ionic/react';
import { fingerPrintOutline, personCircleOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';

interface BiometricAuthProps {
  onFingerprintClick?: () => void;
  onFaceIdClick?: () => void;
  loading?: boolean;
  error?: string | null;
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({ 
  onFingerprintClick, 
  onFaceIdClick,
  loading = false,
  error = null,
}) => {
  const isIos = isPlatform('ios');
  const isAndroid = isPlatform('android');
  const isWeb = !isPlatform('capacitor');
  const [hasCredentials, setHasCredentials] = useState(false);

  useEffect(() => {
    hasStoredBiometricCredentials().then(setHasCredentials);
  }, []);

  // Only show biometric buttons if user has enrolled on this device, or if on web/browser (for testing)
  if (!hasCredentials && !isWeb) return null;

  // Show fingerprint on Android, Face ID on iOS.
  // In browser, show both for testing.
  const showFingerprint = isAndroid || isWeb;
  const showFaceId = isIos || isWeb;

  const typeBiometric = isIos ? 'Face ID' : isAndroid ? 'Huella' : 'Biometría';

  return (
    <div className="mt-md sm:mt-xl pt-md sm:pt-lg border-t border-outline-variant/30 flex flex-col items-center gap-sm sm:gap-md relative z-10">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
        O ingresa con {typeBiometric}
      </span>

      {error && (
        <p className="text-sm text-error text-center">{error}</p>
      )}

      <div className="flex gap-md sm:gap-lg">
        {/* Fingerprint Button */}
        {showFingerprint && (
          <button 
            aria-label="Usar huella dactilar" 
            className="size-14 rounded-card-lg border border-outline-variant/50 bg-surface flex items-center justify-center text-secondary hover:bg-surface-container hover:text-primary hover:border-primary/30 active:scale-95 transition-all shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" 
            type="button"
            disabled={loading}
            onClick={onFingerprintClick}
          >
            {loading ? (
              <span className="size-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            ) : (
              <IonIcon icon={fingerPrintOutline} className="text-3xl" />
            )}
          </button>
        )}

        {/* Face ID Button */}
        {showFaceId && (
          <button 
            aria-label="Usar Face ID" 
            className="size-14 rounded-card-lg border border-outline-variant/50 bg-surface flex items-center justify-center text-secondary hover:bg-surface-container hover:text-primary hover:border-primary/30 active:scale-95 transition-all shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" 
            type="button"
            disabled={loading}
            onClick={onFaceIdClick}
          >
            {loading ? (
              <span className="size-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            ) : (
              <IonIcon icon={personCircleOutline} className="text-3xl" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default BiometricAuth;
