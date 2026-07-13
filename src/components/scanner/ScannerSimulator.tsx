import { IonIcon } from '@ionic/react';
import { scanOutline } from 'ionicons/icons';
import React from 'react';

interface ScannerSimulatorProps {
  onScan: (code: string) => void;
}

/**
 * Minimal floating button to simulate a barcode scan during development.
 * Generates a UUID and triggers the scan flow as if the camera detected it.
 */
const ScannerSimulator: React.FC<ScannerSimulatorProps> = ({ onScan }) => {
  const handleSimulate = () => {
    const uuid = crypto.randomUUID();
    onScan(uuid);
  };

  return (
    <div className="absolute bottom-24 left-0 right-0 z-30 flex justify-center pointer-events-none px-container-padding">
      <button
        type="button"
        onClick={handleSimulate}
        className="pointer-events-auto h-11 px-6! bg-white/95 backdrop-blur-lg text-primary border border-primary/20 shadow-login font-h2 text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer hover:bg-white hover:border-primary/40 rounded-full!">
        <IonIcon icon={scanOutline} className="text-lg" />
        Simular Producto
      </button>
    </div>
  );
};

export default ScannerSimulator;
