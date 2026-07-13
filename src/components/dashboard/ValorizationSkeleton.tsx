import { IonIcon } from '@ionic/react';
import { walletOutline } from 'ionicons/icons';
import React from 'react';

export const ValorizationSkeleton: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-sm shadow-card animate-pulse">
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          Valorización
        </span>
        <IonIcon icon={walletOutline} className="text-primary text-xl" />
      </div>
      <div className="flex flex-col gap-xs">
        <div className="h-8 bg-outline-variant/20 rounded-md w-32 my-1" />
      </div>
    </div>
  );
};

export default ValorizationSkeleton;
