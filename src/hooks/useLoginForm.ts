import { loginWithCredentials } from '@/services/authService';
import { enrollBiometric } from '@/services/biometricService';
import { pushNotificationService } from '@/services/pushNotificationService';
import { useIonViewWillLeave } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export const useLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [enrollPromptOpen, setEnrollPromptOpen] = useState(false);
  const [pendingSession, setPendingSession] = useState<{ userId: string; email: string; password: string } | null>(null);
  const history = useHistory();

  useIonViewWillLeave(() => {
    // Clear credentials for security when leaving the login page
    setUsername('');
    setPassword('');
    setError(null);
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const navigateHome = () => {
    setPendingSession(null);
    history.push('/home');
  };

  const handleEnrollResponse = async (confirmed: boolean) => {
    setEnrollPromptOpen(false);
    if (confirmed && pendingSession) {
      try {
        await enrollBiometric(pendingSession.userId, pendingSession.email, pendingSession.password);
      } catch (err) {
        console.warn('Biometric enrollment skipped:', (err as Error).message);
      }
    }
    navigateHome();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const session = await loginWithCredentials(username, password);

      // Vincular el token FCM del dispositivo con el usuario
      if (session.id) {
        try {
          await pushNotificationService.associateTokenWithUser();
        } catch (pushErr) {
          console.warn('Error al vincular el token FCM con el usuario:', pushErr);
        }
      }

      // If the user hasn't enabled biometrics yet, offer enrollment
      if (!session.id) {
        navigateHome();
        return;
      }

      const { data: profile } = await import('@/services/supabaseClient').then(({ supabase }) =>
        supabase
          .from('profiles')
          .select('biometrics_enabled')
          .eq('id', session.id)
          .single()
      );

      const biometricsEnabled = (profile as { biometrics_enabled: boolean })?.biometrics_enabled ?? false;

      if (!biometricsEnabled) {
        // Store pending data and show the enrollment prompt before navigating
        setPendingSession({ userId: session.id, email: session.email, password });
        setEnrollPromptOpen(true);
      } else {
        navigateHome();
      }
    } catch (error) {
      console.error('Login error:', (error as Error).message);
      setError('Credenciales de inicio de sesión incorrectas.');
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    error,
    loading,
    enrollPromptOpen,
    handleTogglePassword,
    handleEnrollResponse,
    handleSubmit,
  };
};
