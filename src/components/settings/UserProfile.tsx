import { useAvatarEditor } from '@/hooks/useAvatarEditor';
import { IonIcon } from '@ionic/react';
import { pencil } from 'ionicons/icons';
import React from 'react';
import Cropper from 'react-easy-crop';

interface UserProfileProps {
  name?: string;
  role?: string;
  avatarUrl?: string;
  onAvatarChange?: (newAvatarUrl: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  role,
  avatarUrl,
  onAvatarChange,
}) => {
  const {fileInputRef,imageSrc,
    crop,setCrop,
    zoom,setZoom,
    handleAvatarClick,handleFileChange,onCropComplete,handleSave,handleCancel,} = useAvatarEditor(onAvatarChange);

  return (
    <div className="flex flex-col items-center justify-center pt-xl pb-lg">
      {/* Avatar Container */}
      <div className="relative size-36 rounded-full border-2 border-primary shadow-sm">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          aria-label="Subir foto de perfil"
        />
        {/* Circular Image Wrapper */}
        <div
          className="w-full h-full rounded-full overflow-hidden cursor-pointer"
          onClick={handleAvatarClick}
        >
          <img
            alt={name}
            className="block w-full h-full object-cover object-center"
            src={avatarUrl || '/avatar.png'}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/avatar.png';
            }}
          />
        </div>

        {/* Circular Pencil Edit Icon */}
        <div
          role="button"
          aria-label="Editar foto de perfil"
          className="absolute bottom-0 right-0 size-8 bg-primary flex items-center justify-center text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
          onClick={handleAvatarClick}
        >
          <IonIcon icon={pencil} className="text-sm" />
        </div>
      </div>

      <h2 className="text-xl font-bold font-h2 text-on-background mt-3">{name}</h2>
      <p className="text-sm text-outline-variant font-medium mt-1">{role}</p>

      {/* Manual Cropping Modal */}
      {imageSrc && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/85 p-4 animate-fade-in">
          <div
            className="relative bg-surface-container-lowest rounded-login p-6 flex flex-col gap-md shadow-login"
            style={{ width: '100%', maxWidth: '400px' }}
          >
            <h3 className="text-lg font-bold text-on-surface font-h2">Ajustar foto de perfil</h3>
            
            {/* Cropper viewport */}
            <div
              className="relative bg-surface-container rounded-card-lg overflow-hidden min-h-[280px]"
              style={{ width: '100%', aspectRatio: '1 / 1' }}
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            
            {/* Zoom Slider */}
            <div className="flex flex-col gap-xs mt-2">
              <span className="text-xs text-outline font-semibold tracking-wider uppercase">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-sm mt-md">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 h-11 border border-outline/20 text-on-surface-variant hover:bg-surface-container rounded-xl font-body-md font-semibold transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 h-11 bg-primary text-white hover:bg-primary-tint rounded-xl font-body-md font-semibold transition-all cursor-pointer shadow-sm"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
