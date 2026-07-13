import { IonIcon } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';
import React from 'react';

export const WeeklyMovementErrorState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center grow py-md text-center gap-xs">
      <IonIcon icon={alertCircleOutline} className="text-3xl text-rose-500" />
      <p className="text-sm font-semibold text-on-background">Sin información</p>
      <p className="text-xs text-on-surface-variant max-w-2xs">
        No se pudieron cargar los movimientos de stock en este momento.
      </p>
    </div>
  );
};

export default WeeklyMovementErrorState;
