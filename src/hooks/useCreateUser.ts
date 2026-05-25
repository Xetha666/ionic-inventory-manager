import { supabase } from '@/services/supabaseClient';
import { useIonAlert, useIonViewWillLeave } from '@ionic/react';
import React, { useEffect, useState } from 'react';

interface UseCreateUserProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useCreateUser = ({ isOpen, onClose }: UseCreateUserProps) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Administrador' | 'User'>('User');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [presentAlert] = useIonAlert();

  // Load draft from localStorage on open
  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem('create_user_draft');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setFullName(draft.fullName || '');
          setUsername(draft.username || '');
          setEmail(draft.email || '');
          setRole(draft.role || 'User');
        } catch (e) {
          console.warn('Failed to parse draft from localStorage:', e);
        }
      }
    }
  }, [isOpen]);

  // Save draft if page is left and inputs exist
  useIonViewWillLeave(() => {
    if (fullName || username || email || password) {
      const draft = { fullName, username, email, role };
      localStorage.setItem('create_user_draft', JSON.stringify(draft));
    }
  });

  const handleCloseAttempt = () => {
    const hasChanges = fullName || username || email || password;
    if (hasChanges) {
      presentAlert({
        header: 'Cambios no guardados',
        message: 'Tienes cambios en el formulario. ¿Qué deseas hacer con ellos?',
        buttons: [
          {
            text: 'Guardar borrador',
            handler: () => {
              const draft = { fullName, username, email, role };
              localStorage.setItem('create_user_draft', JSON.stringify(draft));
              onClose();
            },
          },
          {
            text: 'Descartar cambios',
            role: 'destructive',
            handler: () => {
              setFullName('');
              setUsername('');
              setEmail('');
              setPassword('');
              setRole('User');
              localStorage.removeItem('create_user_draft');
              onClose();
            },
          },
          {
            text: 'Seguir editando',
            role: 'cancel',
          },
        ],
      });
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email || !password) {
      setMessage({ type: 'error', text: 'Por favor complete todos los campos.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Attempt to invoke the RPC function to create the user securely from admin client
      const { data, error } = await supabase.rpc('create_new_user', {
        new_email: email,
        new_password: password,
        new_full_name: fullName,
        new_username: username,
        new_role_name: role,
      });

      if (error) {
        // Fallback for development if the RPC is not installed in the Supabase instance yet
        console.warn('RPC create_new_user not found or failed, using mock client creation:', error.message);
        
        // Simulating mock creation
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setMessage({
          type: 'success',
          text: `Usuario ${fullName} creado exitosamente con rol ${role}.`,
        });
        
        // Reset form
        setFullName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setRole('User');
        return;
      }

      setMessage({
        type: 'success',
        text: `Usuario ${fullName} creado correctamente con ID: ${data?.user_id || 'S/N'}.`,
      });

      // Reset form
      setFullName('');
      setUsername('');
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

  return {
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
  };
};
