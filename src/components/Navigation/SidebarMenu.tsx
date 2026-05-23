import { IonIcon } from '@ionic/react';
import {
  barChartOutline,
  closeOutline,
  cubeOutline,
  gridOutline,
  logOutOutline,
  settingsOutline,
  swapHorizontalOutline
} from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activePath?: string;
}

const menuItems = [
  { name: 'Inicio', icon: gridOutline, path: '/home' },
  { name: 'Inventario', icon: cubeOutline, path: '/inventory' },
  { name: 'Movimientos', icon: swapHorizontalOutline, path: '/movements' },
  { name: 'Reportes', icon: barChartOutline, path: '/reports' },
  { name: 'Configuración', icon: settingsOutline, path: '/settings' },
];

const SidebarMenu: React.FC<SidebarMenuProps> = ({ 
  isOpen, 
  onClose,
  activePath = '/home'
}) => {
  const history = useHistory();

  const handleNavigate = (path: string) => {
    history.push(path);
    onClose();
  };

  const handleLogout = () => {
    history.push('/login');
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-on-background/20 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-outline-variant/30 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header/Logo */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-outline-variant/20">
          <div className="flex items-center gap-sm">
            <div className="inline-flex items-center justify-center size-8 bg-primary rounded-lg text-on-primary">
              <IonIcon icon={cubeOutline} className="text-xl" />
            </div>
            <span className="font-h2 text-body-lg font-bold text-primary tracking-tight">
              InventoryFlow
            </span>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden size-8 flex items-center justify-center text-outline hover:text-on-surface rounded-full hover:bg-surface-container transition-colors cursor-pointer"
            aria-label="Cerrar menú"
          >
            <IonIcon icon={closeOutline} className="text-xl" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-xs overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activePath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-md px-4 py-3 rounded-xl font-label-caps text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-primary-container text-on-primary-container shadow-sm border-l-4 border-primary' 
                    : 'text-secondary hover:bg-surface-container hover:text-on-surface-variant'
                }`}
              >
                <IonIcon 
                  icon={item.icon} 
                  className={`text-xl ${isActive ? 'text-primary' : 'text-outline'}`} 
                />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-lowest">
          <div className="flex items-center gap-md mb-4 p-2 rounded-xl">
            <div className="size-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold shadow-sm">
              B
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-body-md font-semibold text-on-surface truncate">Bryan</span>
              <span className="text-xs text-outline truncate">Administrador</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-md px-4 py-3 rounded-xl font-label-caps text-sm font-medium text-error hover:bg-error-container/20 transition-all duration-200 cursor-pointer"
          >
            <IonIcon icon={logOutOutline} className="text-xl" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarMenu;
