import BottomNavBar from '@/components/navigation/BottomNavBar';
import ScannerProductModal from '@/components/scanner/ScannerProductModal';
import ScannerRegisterModal from '@/components/scanner/ScannerRegisterModal';
import ScannerSimulator from '@/components/scanner/ScannerSimulator';
import ScannerViewfinder from '@/components/scanner/ScannerViewfinder';
import { useScanner } from '@/hooks/useScanner';
import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { closeOutline, flashOffOutline, flashOutline } from 'ionicons/icons';
import React from 'react';

const Scanner: React.FC = () => {
  const {camera,scannedCode,isFlashEffectActive,detectedProduct,isProductModalOpen,isRegisterModalOpen,toastMessage,dismissToast,handleScan,handleToggleFlash,handleStockUpdated,handleProductCreated,resumeScanning} = useScanner();

  return (
    <IonPage>
      <IonContent scrollY={false} className="relative bg-black select-none">

        {/* Camera Feed + Viewfinder Overlay */}
        <ScannerViewfinder
          hasCameraPermission={camera.hasCameraPermission}
          isFlashEffectActive={isFlashEffectActive}
          videoRef={camera.videoRef}
        />

        {/* Floating Camera Controls (flash only) */}
        {camera.hasCameraPermission && (
          <div className="scanner-camera-controls">
            <button
              type="button"
              onClick={handleToggleFlash}
              className={`w-12 h-12 rounded-full! flex items-center justify-center transition-all backdrop-blur-md border pointer-events-auto active:scale-90 cursor-pointer ${
                camera.isFlashOn
                  ? 'bg-amber-500 text-white border-amber-500 scanner-flash-active-shadow'
                  : 'bg-black/50 text-white/80 border-white/20 hover:bg-black/70'
              }`}
              aria-label="Alternar Linterna"
            >
              <IonIcon icon={camera.isFlashOn ? flashOutline : flashOffOutline} className="text-xl" />
            </button>
          </div>
        )}

        {/* Simulate Scan Button */}
        <ScannerSimulator onScan={handleScan} />

      </IonContent>

      <BottomNavBar activePath="/scanner" />

      {/* Product Detail Modal */}
      <ScannerProductModal
        product={detectedProduct}
        isOpen={isProductModalOpen}
        onClose={resumeScanning}
        onStockUpdated={handleStockUpdated}
      />

      {/* Register New Product Modal */}
      <ScannerRegisterModal
        barcode={scannedCode}
        isOpen={isRegisterModalOpen}
        onClose={resumeScanning}
        onProductCreated={handleProductCreated}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md text-white/95 border border-white/10 px-4 py-2.5 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-semibold animate-bounce">
          <span className="font-body-md">{toastMessage}</span>
          <button onClick={dismissToast} className="p-0.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white shrink-0 cursor-pointer">
            <IonIcon icon={closeOutline} className="text-sm" />
          </button>
        </div>
      )}
    </IonPage>
  );
};

export default Scanner;
