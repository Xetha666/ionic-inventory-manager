import { getSettingsConfig } from '@/data/settingsData';
import { getLocalUserSession, logoutUser, updateLocalUserSession } from '@/services/authService';
import { uploadAvatar } from '@/services/avatarService';
import { supabase } from '@/services/supabaseClient';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export const useSettings = () => {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; role: string; avatarUrl?: string }>(() => {
    const session = getLocalUserSession();
    return {
      name: session?.name || 'Usuario',
      role: session?.role || 'User',
      avatarUrl: session?.avatarUrl || '/avatar.png',
    };
  });

  // 1. Efecto para obtener el perfil de usuario desde Supabase al montar la vista
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select(`
              full_name,
              avatar_url,
              roles ( name )
            `)
            .eq('id', user.id)
            .single();

          if (profile) {
            const roleName = (profile.roles as any)?.name || 'User';
            const dbAvatarUrl = (profile as any).avatar_url;

            // Cache buster para evitar que el navegador cargue una versión vieja de la caché
            const finalAvatarUrl = dbAvatarUrl
              ? `${dbAvatarUrl}?t=${Date.now()}`
              : undefined;

            setUserProfile((prev) => ({
              ...prev,
              name: (profile as any).full_name || 'Usuario',
              role: roleName,
              avatarUrl: finalAvatarUrl || prev.avatarUrl || '/avatar.png',
            }));

            if (finalAvatarUrl) {
              updateLocalUserSession({ avatarUrl: finalAvatarUrl });
            }
          }
        }
      } catch (err) {
        console.warn('Error fetching user profile from Supabase:', err);
      }
    };

    fetchUserProfile();
  }, []);

  // 2. Cerrar sesión del usuario
  const handleLogout = async () => {
    await logoutUser();
    history.replace('/login');
  };

  // 3. Subir el avatar al storage y actualizar perfil en la base de datos
  const handleAvatarChange = async (newAvatarUrl: string) => {
    const previousAvatarUrl = userProfile.avatarUrl;
    // Actualización local optimista
    setUserProfile((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Guardar en Storage y BD
        const publicUrl = await uploadAvatar(user.id, newAvatarUrl);
        const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;

        setUserProfile((prev) => ({ ...prev, avatarUrl: cacheBustedUrl }));
        updateLocalUserSession({ avatarUrl: cacheBustedUrl });
      } else {
        throw new Error('No hay sesión de usuario activa para guardar el avatar.');
      }
    } catch (err: any) {
      console.error('Error al actualizar la foto de perfil:', err);
      // Revertir actualización optimista
      setUserProfile((prev) => ({ ...prev, avatarUrl: previousAvatarUrl }));
      alert(`No se pudo guardar la foto de perfil: ${err.message}`);
    }
  };

  // 4. Configuración de ítems de menú usando los manejadores de eventos
  const { accountItems, warehouseItems, adminItems, supportItems } = getSettingsConfig({
    onSecurity: () => console.log('Click: Seguridad'),
    onNotifications: () => console.log('Click: Notificaciones'),
    onLocation: () => console.log('Click: Ubicación'),
    onPreferences: () => console.log('Click: Preferencias'),
    onUserManagement: () => setIsModalOpen(true),
    onHelp: () => console.log('Click: Centro de Ayuda'),
  });

  return {
    userProfile,
    isModalOpen,
    setIsModalOpen,
    handleLogout,
    handleAvatarChange,
    accountItems,
    warehouseItems,
    adminItems,
    supportItems,
  };
};
