import { IonIcon } from '@ionic/react';
import { barChartOutline } from 'ionicons/icons';
import React from 'react';

export const WeeklyMovementEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center grow py-md text-center gap-xs">
      <IonIcon icon={barChartOutline} className="text-3xl text-primary" />
      <p className="text-sm font-semibold text-on-background">Sin movimientos</p>
      <p className="text-xs text-on-surface-variant max-w-2xs">
        No se han registrado entradas o salidas de stock durante esta semana.
      </p>
    </div>
  );
};

export default WeeklyMovementEmptyState;
