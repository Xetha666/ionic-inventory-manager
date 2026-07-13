import ValorizationSkeleton from '@/components/dashboard/ValorizationSkeleton';
import { IonIcon } from '@ionic/react';
import { walletOutline } from 'ionicons/icons';
import React from 'react';

interface ValorizationCardProps {
  value?: number;
  loading?: boolean;
}

const ValorizationCard: React.FC<ValorizationCardProps> = ({value = 0,loading = false,}) =>{
  if (loading) {
    return <ValorizationSkeleton />;
  }

  const formattedValuation = new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-sm shadow-card">
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          Valorización
        </span>
        <IonIcon icon={walletOutline} className="text-primary text-xl" />
      </div>
      <div className="flex flex-col gap-xs">
        <span className="font-h1 text-h1 text-on-background">S/{formattedValuation}</span>
      </div>
    </div>
  );
};

export default ValorizationCard;
