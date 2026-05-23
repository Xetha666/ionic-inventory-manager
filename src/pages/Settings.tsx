import BottomNavBar from '@/components/navigation/BottomNavBar';
import SettingsGroup from '@/components/settings/SettingsGroup';
import SettingsTopBar from '@/components/settings/SettingsTopBar';
import UserProfile from '@/components/settings/UserProfile';
import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { getSettingsConfig } from '@/components/settings/settingsData';
import { logOutOutline } from 'ionicons/icons';
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

  const { accountItems, warehouseItems, supportItems } = getSettingsConfig({
    onSecurity: () => console.log('Click: Seguridad'),
    onNotifications: () => console.log('Click: Notificaciones'),
    onLocation: () => console.log('Click: Ubicación'),
    onPreferences: () => console.log('Click: Preferencias'),
    onHelp: () => console.log('Click: Centro de Ayuda'),
  });

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
