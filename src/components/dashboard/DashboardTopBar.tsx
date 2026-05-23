import React from 'react';

interface DashboardTopBarProps {
  title?: string;
  avatarUrl?: string;
}

const DashboardTopBar: React.FC<DashboardTopBarProps> = ({
  title = 'InventoryFlow',
  avatarUrl,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/30 shadow-sm flex items-center justify-between px-md h-16 w-full">
      {/* Avatar */}
      <div className="flex items-center gap-stack-gap hover:bg-surface-container transition-colors active:scale-95 duration-150 rounded-full p-1 cursor-pointer">
        {avatarUrl ? (
          <img
            alt="Foto de perfil"
            className="w-8 h-8 rounded-full object-cover border border-outline-variant"
            src={avatarUrl}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm border border-outline-variant">
            B
          </div>
        )}
      </div>

      {/* Logo/Title */}
      <h1 className="text-xl font-black tracking-tight text-primary">
        {title}
      </h1>

      {/* Empty spacer to keep centered title */}
      <div className="w-10 h-10"></div>
    </header>
  );
};

export default DashboardTopBar;
