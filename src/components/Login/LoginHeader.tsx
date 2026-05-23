import { IonIcon } from '@ionic/react';
import { cubeOutline } from 'ionicons/icons';
import React from 'react';

const LoginHeader: React.FC = () => {
  return (
    <header className="text-center mb-md sm:mb-xl relative z-10">
      <div className="inline-flex items-center justify-center size-12 bg-primary-container rounded-xl mb-sm sm:mb-md shadow-sm">
        <IonIcon 
          icon={cubeOutline} 
          className="text-on-primary-container text-3xl" 
        />
      </div>
      <h1 className="font-h1 text-h1 text-primary tracking-tight">InventoryFlow</h1>
      <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
        Accede al panel de tu almacén
      </p>
    </header>
  );
};

export default LoginHeader;
