import { IonIcon } from '@ionic/react';
import { pencil } from 'ionicons/icons';
import React from 'react';

interface UserProfileProps {
  name?: string;
  role?: string;
  avatarUrl?: string;
  onEditClick?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name = 'Alejandro Moreno',
  role = 'Gerente de Operaciones',
  avatarUrl = '/avatar.png',
  onEditClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center pt-xl pb-lg">
      {/* Avatar Container */}
      <div className="relative w-24 h-24">
        <img
          alt={name}
          className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
          src={avatarUrl}
        />
        {/* Pencil Edit Icon */}
        <button
          aria-label="Editar perfil"
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white border-2 border-white hover:bg-primary-tint active:scale-90 transition-all shadow-sm cursor-pointer"
          type="button"
          onClick={onEditClick}
        >
          <IonIcon icon={pencil} className="text-sm" />
        </button>
      </div>

      {/* User Information */}
      <h2 className="text-xl font-bold font-h2 text-on-background mt-3">
        {name}
      </h2>
      <p className="text-sm text-outline-variant font-medium mt-1">
        {role}
      </p>
    </div>
  );
};

export default UserProfile;
