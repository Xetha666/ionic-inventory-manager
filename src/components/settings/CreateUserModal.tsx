import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import Spinner from '@/components/common/Spinner';
import { useCreateUser } from '@/hooks/useCreateUser';
import { IonIcon, IonModal } from '@ionic/react';
import {
  eyeOffOutline,
  eyeOutline,
  mailOutline,
  personAddOutline,
  personOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import React from 'react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose }) => {
  const {
    fullName,
    setFullName,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    showPassword,
    setShowPassword,
    loading,
    message,
    handleCloseAttempt,
    handleSubmit,
  } = useCreateUser({ isOpen, onClose });

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} backdropDismiss={false} className="create-user-modal">
      <div className="flex flex-col h-full bg-surface-container-lowest overflow-y-auto">
        {/* Header */}
        <div className="flex items-center px-6 py-5 border-b border-outline-variant/10">
          <div className="flex items-center gap-sm">
            <div className="flex size-10 rounded-xl bg-primary/10 items-center justify-center text-primary">
              <IonIcon icon={personAddOutline} className="text-xl" />
            </div>
            <h2 className="text-lg font-bold font-h2 text-on-surface">
              Crear Nuevo Usuario
            </h2>
          </div>
        </div>

        {/* Form Body */}
        <form className="p-6 flex flex-col gap-md" onSubmit={handleSubmit}>
          {message && (
            <div
              className={`p-4 rounded-2xl text-sm font-medium border ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                  : 'bg-error/10 border-error/20 text-error'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Full Name */}
          <FormInput
            label="Nombre Completo"
            icon={personOutline}
            placeholder="Ej. Juan Pérez"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />

          {/* Username */}
          <FormInput
            label="Nombre de Usuario"
            icon={personOutline}
            placeholder="juanperez"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />

          {/* Email */}
          <FormInput
            label="Correo Electrónico"
            icon={mailOutline}
            placeholder="correo@ejemplo.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          {/* Password */}
          <FormInput
            label="Contraseña"
            icon={shieldCheckmarkOutline}
            placeholder="Mínimo 6 caracteres"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            suffix={
              <button
                className="text-outline hover:text-on-surface transition-colors cursor-pointer flex items-center justify-center"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} className="text-lg" />
              </button>
            }
          />

          {/* Role Selector Dropdown */}
          <FormSelect
            label="Rol del Usuario"
            icon={shieldCheckmarkOutline}
            value={role}
            onChange={(e) => setRole(e.target.value as 'Administrador' | 'User')}
            disabled={loading}
            options={[
              { value: 'User', label: 'Usuario Común (Lectura/Escritura básica)' },
              { value: 'Administrador', label: 'Administrador (Acceso y control total)' },
            ]}
          />

          {/* Form Actions */}
          <div className="flex gap-sm mt-md">
            <button className="flex-1 h-12 border border-outline-variant/50 hover:bg-outline-variant/10 active:bg-outline-variant/20 rounded-2xl font-body-md font-semibold text-outline hover:text-on-surface transition-all cursor-pointer" type="button" onClick={handleCloseAttempt} disabled={loading}>
              Cancelar
            </button>
            <button className="flex-1 h-12 bg-primary hover:bg-primary-tint active:scale-98 text-white rounded-2xl font-body-md font-semibold transition-all shadow-button flex items-center justify-center gap-xs cursor-pointer" type="submit" disabled={loading}>
              {loading ? (
                <Spinner size="md" color="border-white" />
              ) : (
                'Crear Usuario'
              )}
            </button>
          </div>
        </form>
      </div>
    </IonModal>
  );
};

export default CreateUserModal;
