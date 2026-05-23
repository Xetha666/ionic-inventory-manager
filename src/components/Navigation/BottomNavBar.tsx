import { IonIcon } from '@ionic/react';
import {
  homeOutline,
  home,
  cubeOutline,
  cube,
  qrCodeOutline,
  qrCode,
  settingsOutline,
  settings
} from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';

interface BottomNavBarProps {
  activePath?: string;
}

const navItems = [
  { name: 'Home', iconOutline: homeOutline, iconFilled: home, path: '/home' },
  { name: 'Inventory', iconOutline: cubeOutline, iconFilled: cube, path: '/inventory' },
  { name: 'Scanner', iconOutline: qrCodeOutline, iconFilled: qrCode, path: '/scanner' },
  { name: 'Settings', iconOutline: settingsOutline, iconFilled: settings, path: '/settings' },
];

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activePath = '/home' }) => {
  const history = useHistory();

  return (
    <nav className="bg-white/90 backdrop-blur-lg fixed w-full z-50 rounded-t-2xl border-t border-outline-variant/30 shadow-[0_-4px_12px_rgba(30,41,59,0.05)] bottom-0 left-0 right-0 h-20 px-lg flex items-center justify-between pb-[env(safe-area-inset-bottom)]">
      {navItems.map((item) => {
        const isActive = activePath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => history.push(item.path)}
            className={`flex flex-col items-center justify-center gap-1 min-w-[64px] rounded-xl px-3 py-1 active:scale-90 transition-transform duration-200 cursor-pointer ${
              isActive
                ? 'text-primary bg-primary-fixed/30'
                : 'text-outline-variant hover:text-on-surface-variant'
            }`}
          >
            <IonIcon
              icon={isActive ? item.iconFilled : item.iconOutline}
              className="text-[24px]"
            />
            <span className="font-h2 text-[11px] font-semibold uppercase tracking-wider">
              {item.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;
