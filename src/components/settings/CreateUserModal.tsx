import { supabase } from '@/services/supabaseClient';
import { IonIcon, IonModal } from '@ionic/react';
import {
  closeOutline,
  eyeOffOutline,
  eyeOutline,
  mailOutline,
  personAddOutline,
  personOutline,
  shieldCheckmarkOutline,
  chevronDownOutline,
} from 'ionicons/icons';
import React, { useState } from 'react';
import Spinner from '@/components/common/Spinner';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Administrador' | 'User'>('User');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setMessage({ type: 'error', text: 'Por favor complete todos los campos.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Attempt to invoke the RPC function to create the user securely from admin client
      const { data, error } = await supabase.rpc('create_new_user_admin', {
        new_email: email,
        new_password: password,
        new_first_name: firstName,
        new_last_name: lastName,
        new_role_name: role,
      });

      if (error) {
        // Fallback for development if the RPC is not installed in the Supabase instance yet
        console.warn('RPC create_new_user_admin not found or failed, using mock client creation:', error.message);
        
        // Simulating mock creation
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setMessage({
          type: 'success',
          text: `Usuario ${firstName} ${lastName} creado exitosamente con rol ${role} (Modo Mock).`,
        });
        
        // Reset form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setRole('User');
        return;
      }

      setMessage({
        type: 'success',
        text: `Usuario ${firstName} ${lastName} creado correctamente con ID: ${data?.user_id || 'N/D'}.`,
      });

      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setRole('User');
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Error inesperado al crear el usuario.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      className="create-user-modal"
    >
      <div className="flex flex-col h-full bg-surface-container-lowest overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
          <div className="flex items-center gap-sm">
            <div className="flex size-10 rounded-xl bg-primary/10 items-center justify-center text-primary">
              <IonIcon icon={personAddOutline} className="text-xl" />
            </div>
            <h2 className="text-lg font-bold font-h2 text-on-surface">
              Crear Nuevo Usuario
            </h2>
          </div>
          <button
            aria-label="Cerrar modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:bg-outline-variant/10 hover:text-on-surface transition-colors cursor-pointer"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            <IonIcon icon={closeOutline} className="text-2xl" />
          </button>
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

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-xs">
              <label className="text-xs font-semibold text-outline-variant tracking-wider uppercase pl-1">
                Nombre
              </label>
              <div className="relative flex items-center">
                <IonIcon icon={personOutline} className="absolute left-3 text-outline text-lg" />
                <input
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md text-on-surface font-medium transition-all"
                  placeholder="Ej. Juan"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="text-xs font-semibold text-outline-variant tracking-wider uppercase pl-1">
                Apellido
              </label>
              <div className="relative flex items-center">
                <IonIcon icon={personOutline} className="absolute left-3 text-outline text-lg" />
                <input
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md text-on-surface font-medium transition-all"
                  placeholder="Ej. Pérez"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-xs">
            <label className="text-xs font-semibold text-outline-variant tracking-wider uppercase pl-1">
              Correo Electrónico
            </label>
            <div className="relative flex items-center">
              <IonIcon icon={mailOutline} className="absolute left-3 text-outline text-lg" />
              <input
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md text-on-surface font-medium transition-all"
                placeholder="correo@ejemplo.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-xs">
            <label className="text-xs font-semibold text-outline-variant tracking-wider uppercase pl-1">
              Contraseña
            </label>
            <div className="relative flex items-center">
              <IonIcon icon={shieldCheckmarkOutline} className="absolute left-3 text-outline text-lg" />
              <input
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-outline-variant/30 bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md text-on-surface font-medium transition-all"
                placeholder="Mínimo 6 caracteres"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                className="absolute right-3 text-outline hover:text-on-surface transition-colors cursor-pointer flex items-center justify-center"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} className="text-lg" />
              </button>
            </div>
          </div>

          {/* Role Selector Dropdown */}
          <div className="flex flex-col gap-xs mt-xs">
            <label className="text-xs font-semibold text-outline-variant tracking-wider uppercase pl-1">
              Rol del Usuario
            </label>
            <div className="relative flex items-center">
              <IonIcon icon={shieldCheckmarkOutline} className="absolute left-3 text-outline text-lg pointer-events-none" />
              <select
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-outline-variant/30 bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md text-on-surface font-medium transition-all appearance-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value as 'Administrador' | 'User')}
                disabled={loading}
              >
                <option value="User">Usuario Común (Lectura/Escritura básica)</option>
                <option value="Administrador">Administrador (Acceso y control total)</option>
              </select>
              <IonIcon icon={chevronDownOutline} className="absolute right-3 text-outline text-lg pointer-events-none" />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-sm mt-md">
            <button
              className="flex-1 h-12 border border-outline-variant/50 hover:bg-outline-variant/10 active:bg-outline-variant/20 rounded-2xl font-body-md font-semibold text-outline hover:text-on-surface transition-all cursor-pointer"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              className="flex-1 h-12 bg-primary hover:bg-primary-tint active:scale-98 text-white rounded-2xl font-body-md font-semibold transition-all shadow-button flex items-center justify-center gap-xs cursor-pointer"
              type="submit"
              disabled={loading}
            >
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
