import { SettingsItemProps } from '@/components/settings/SettingsItem';
import {
  helpCircleOutline,
  locationOutline,
  notificationsOutline,
  optionsOutline,
  peopleOutline,
  shieldHalfOutline,
} from 'ionicons/icons';

interface SettingsActions {
  onSecurity: () => void;
  onNotifications: () => void;
  onLocation: () => void;
  onPreferences: () => void;
  onHelp: () => void;
  onUserManagement?: () => void;
}

export const getSettingsConfig = (actions: SettingsActions) => {
  const accountItems: SettingsItemProps[] = [
    {
      icon: shieldHalfOutline,
      title: 'Seguridad',
      subtitle: 'Contraseña, 2FA, Historial de sesiones',
      onClick: actions.onSecurity,
    },
    {
      icon: notificationsOutline,
      title: 'Notificaciones',
      subtitle: 'Push, Correo, Alertas de inventario',
      onClick: actions.onNotifications,
    },
  ];

  const warehouseItems: SettingsItemProps[] = [
    {
      icon: locationOutline,
      title: 'Ubicación',
      subtitle: 'Centro principal, Zonas de envío',
      iconBgClass: 'bg-blue-100/60',
      iconColorClass: 'text-blue-600',
      onClick: actions.onLocation,
    },
    {
      icon: optionsOutline,
      title: 'Preferencias',
      subtitle: 'Idioma, Unidades, Modos de visualización',
      iconBgClass: 'bg-blue-100/60',
      iconColorClass: 'text-blue-600',
      onClick: actions.onPreferences,
    },
  ];

  const adminItems: SettingsItemProps[] = [
    {
      icon: peopleOutline,
      title: 'Gestión de Usuarios',
      subtitle: 'Crear, editar y administrar permisos de usuarios',
      iconBgClass: 'bg-orange-100/60',
      iconColorClass: 'text-orange-600',
      onClick: actions.onUserManagement,
    },
  ];

  const supportItems: SettingsItemProps[] = [
    {
      icon: helpCircleOutline,
      title: 'Centro de Ayuda',
      subtitle: 'Preguntas frecuentes, Guías, Chat en vivo',
      isExternal: true,
      iconBgClass: 'bg-secondary-container/50',
      iconColorClass: 'text-on-secondary-container',
      onClick: actions.onHelp,
    },
  ];

  return {
    accountItems,
    warehouseItems,
    adminItems,
    supportItems,
  };
};
