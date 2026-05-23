import SettingsGroup from '@/components/Settings/SettingsGroup';
import SettingsTopBar from '@/components/Settings/SettingsTopBar';
import UserProfile from '@/components/Settings/UserProfile';
import BottomNavBar from '@/components/Navigation/BottomNavBar';
import { IonContent, IonIcon, IonPage } from '@ionic/react';
import {
  helpCircleOutline,
  locationOutline,
  logOutOutline,
  notificationsOutline,
  optionsOutline,
  shieldHalfOutline,
} from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';

const Settings: React.FC = () => {
  const history = useHistory();

  const handleLogout = () => {
    history.push('/login');
  };

  const handleSearchClick = () => {
    console.log('Settings: Search Clicked');
  };

  const handleEditProfile = () => {
    console.log('Settings: Edit Profile Clicked');
  };

  const accountItems = [
    {
      icon: shieldHalfOutline,
      title: 'Seguridad',
      subtitle: 'Contraseña, 2FA, Historial de sesiones',
      onClick: () => console.log('Click: Seguridad'),
    },
    {
      icon: notificationsOutline,
      title: 'Notificaciones',
      subtitle: 'Push, Correo, Alertas de inventario',
      onClick: () => console.log('Click: Notificaciones'),
    },
  ];

  const warehouseItems = [
    {
      icon: locationOutline,
      title: 'Ubicación',
      subtitle: 'Centro principal, Zonas de envío',
      iconBgClass: 'bg-blue-100/60',
      iconColorClass: 'text-blue-600',
      onClick: () => console.log('Click: Ubicación'),
    },
    {
      icon: optionsOutline,
      title: 'Preferencias',
      subtitle: 'Idioma, Unidades, Modos de visualización',
      iconBgClass: 'bg-blue-100/60',
      iconColorClass: 'text-blue-600',
      onClick: () => console.log('Click: Preferencias'),
    },
  ];

  const supportItems = [
    {
      icon: helpCircleOutline,
      title: 'Centro de Ayuda',
      subtitle: 'Preguntas frecuentes, Guías, Chat en vivo',
      isExternal: true,
      iconBgClass: 'bg-secondary-container/50',
      iconColorClass: 'text-on-secondary-container',
      onClick: () => console.log('Click: Centro de Ayuda'),
    },
  ];

  return (
    <IonPage>
      {/* Settings Top Bar */}
      <SettingsTopBar onSearchClick={handleSearchClick} />

      {/* Main Settings Canvas */}
      <IonContent scrollY={true}>
        <main className="px-container-padding pb-bottom-nav-safe flex flex-col gap-lg bg-surface">
          {/* User Profile Component */}
          <UserProfile onEditClick={handleEditProfile} />

          {/* Settings Groups */}
          <section className="flex flex-col gap-lg">
            {/* Account Settings */}
            <SettingsGroup label="Cuenta" items={accountItems} />

            {/* Warehouse Settings */}
            <SettingsGroup label="Almacén" items={warehouseItems} />

            {/* Support Settings */}
            <SettingsGroup label="Soporte" items={supportItems} />
          </section>

          {/* Logout Action Button */}
          <button
            className="w-full h-12 border border-error/20 text-error hover:bg-error/5 active:bg-error/10 rounded-2xl font-body-md font-semibold flex items-center justify-center gap-sm transition-all mt-md cursor-pointer bg-white shadow-sm"
            type="button"
            onClick={handleLogout}
          >
            <IonIcon icon={logOutOutline} className="text-xl" />
            Cerrar Sesión
          </button>

          {/* Version Footer */}
          <footer className="flex flex-col items-center justify-center gap-1 py-lg text-center">
            <span className="text-[10px] text-outline font-semibold tracking-widest uppercase">
              INVENTORYFLOW V2.4.1
            </span>
            <span className="text-[11px] text-outline-variant font-medium">
              Hecho con precisión para logística global
            </span>
          </footer>
        </main>
      </IonContent>

      {/* Bottom Navigation Menu */}
      <BottomNavBar activePath="/settings" />
    </IonPage>
  );
};

export default Settings;
