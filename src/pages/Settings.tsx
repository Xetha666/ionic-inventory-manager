import BottomNavBar from '@/components/navigation/BottomNavBar';
import CreateUserModal from '@/components/settings/CreateUserModal';
import SettingsGroup from '@/components/settings/SettingsGroup';
import UserProfile from '@/components/settings/UserProfile';
import { getSettingsConfig } from '@/data/settingsData';
import { supabase } from '@/services/supabaseClient';
import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const Settings: React.FC = () => {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; role: string }>({
    name: 'Alejandro Moreno',
    role: 'Administrador', // Default to Administrador to easily test in mock mode
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select(`
              first_name,
              last_name,
              roles ( name )
            `)
            .eq('id', user.id)
            .single();

          if (profile) {
            const roleName = (profile.roles as any)?.name || 'User';
            setUserProfile({
              name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Usuario',
              role: roleName,
            });
          }
        }
      } catch (err) {
        console.warn('Error fetching user profile from Supabase:', err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    history.push('/login');
  };

  const handleEditProfile = () => {
    console.log('Settings: Edit Profile Clicked');
  };

  const { accountItems, warehouseItems, adminItems, supportItems } = getSettingsConfig({
    onSecurity: () => console.log('Click: Seguridad'),
    onNotifications: () => console.log('Click: Notificaciones'),
    onLocation: () => console.log('Click: Ubicación'),
    onPreferences: () => console.log('Click: Preferencias'),
    onUserManagement: () => setIsModalOpen(true),
    onHelp: () => console.log('Click: Centro de Ayuda'),
  });

  return (
    <IonPage>
      {/* Main Settings Canvas */}
      <IonContent scrollY={true}>
        <main className="px-container-padding pb-bottom-nav-safe flex flex-col gap-lg bg-surface">
          {/* User Profile Component */}
          <UserProfile name={userProfile.name} role={userProfile.role} onEditClick={handleEditProfile} />

          {/* Settings Groups */}
          <section className="flex flex-col gap-lg">
            {/* Account Settings */}
            <SettingsGroup label="Cuenta" items={accountItems} />

            {/* Warehouse Settings */}
            <SettingsGroup label="Almacén" items={warehouseItems} />

            {/* Administration Settings (Admin only) */}
            {userProfile.role === 'Administrador' && (
              <SettingsGroup label="Administración" items={adminItems} />
            )}

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
            <span className="text-sm text-outline font-semibold tracking-widest uppercase">
              INVENTORYFLOW V2.4.1
            </span>
            <span className="text-xs text-outline-variant font-medium">
              Hecho con precisión para logística global
            </span>
          </footer>
        </main>
      </IonContent>

      {/* Bottom Navigation Menu */}
      <BottomNavBar activePath="/settings" />

      {/* Create User Modal */}
      <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </IonPage>
  );
};

export default Settings;
