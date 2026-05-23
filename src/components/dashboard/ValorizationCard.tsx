import { IonIcon } from '@ionic/react';
import { trendingUpOutline, walletOutline } from 'ionicons/icons';
import React from 'react';

interface ValorizationCardProps {
  value?: string;
  trend?: string;
}

const ValorizationCard: React.FC<ValorizationCardProps> = ({
  value = '$2,450,180',
  trend = '+4.2%',
}) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-sm shadow-card">
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          Valorización
        </span>
        <IonIcon icon={walletOutline} className="text-primary text-xl" />
      </div>
      <div className="flex flex-col gap-xs">
        <span className="font-h1 text-h1 text-on-background">{value}</span>
        <div className="flex items-center gap-xs text-primary bg-primary/10 w-fit px-2 py-0.5 rounded-sm">
          <IonIcon icon={trendingUpOutline} className="text-sm" />
          <span className="font-data-tabular text-data-tabular text-xs">
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ValorizationCard;
