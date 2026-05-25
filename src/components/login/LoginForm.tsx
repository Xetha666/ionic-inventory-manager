import { setLocalUserSession } from '@/services/authService';
import { supabase } from '@/services/supabaseClient';
import Spinner from '../common/Spinner';
import { IonIcon, useIonViewWillLeave } from '@ionic/react';
import { arrowForwardOutline, eyeOffOutline, eyeOutline, lockClosedOutline, personOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

interface LoginFormProps {
  onLogin?: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const normalizedInput = username.trim();
    let resolvedEmail = normalizedInput;

    try {
      // 1. Resolve username to email if it's not a direct email
      if (!normalizedInput.includes('@')) {
        const { data: resolved, error: rpcError } = await supabase.rpc('get_user_email', {
          username_input: normalizedInput,
        });

        if (rpcError) {
          throw new Error('No se pudo verificar el nombre de usuario.');
        }

        if (!resolved) {
          throw new Error('Nombre de usuario no encontrado.');
        }
        resolvedEmail = resolved;
      }

      // 2. Perform authenticating with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: resolvedEmail,
        password,
      });

      if (authError) {
        throw new Error(
          authError.message === 'Invalid login credentials' 
            ? 'Credenciales de inicio de sesión incorrectas.' 
            : authError.message
        );
      }

      if (!authData.user) {
        throw new Error('Error al iniciar sesión.');
      }

      // 3. Fetch public profile details (role and full_name)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          full_name,
          avatar_url,
          roles (
            name
          )
        `)
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('No se encontró el perfil del usuario.');
      }

      const roleName = (profile.roles as any)?.name || 'User';

      // 4. Store session in localStorage (for application state)
      setLocalUserSession({
        name: profile.full_name || 'Usuario',
        email: resolvedEmail,
        role: roleName as 'Administrador' | 'User',
        avatarUrl: profile.avatar_url || '/avatar.png',
      });

      if (onLogin) {
        onLogin(resolvedEmail, password);
      } else {
        console.log('Login successful:', resolvedEmail);
        history.push('/home');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-md sm:gap-lg relative z-10" onSubmit={handleSubmit}>
      {error && (
        <div className="p-4 rounded-2xl text-sm font-medium border bg-error/10 border-error/20 text-error shrink-0">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-sm sm:gap-stack-gap">
        {/* Username / Email Input */}
        <div className="flex flex-col gap-xs">
          <label 
            className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider ml-xs" 
            htmlFor="username"
          >
            Nombre de Usuario o Correo
          </label>
          <div className="relative">
            <IonIcon 
              icon={personOutline} 
              className="absolute left-md top-1/2 -translate-y-1/2 text-outline text-xl" 
            />
            <input 
              className="w-full h-12 pl-11 pr-md rounded-card-lg border border-outline/20 bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm" 
              id="username" 
              placeholder="Ej. juanperez o correo@ejemplo.com" 
              type="text"
              required
              disabled={loading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-xs">
          <div className="flex justify-between items-center ml-xs mr-xs">
            <label 
              className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" 
              htmlFor="password"
            >
              Contraseña
            </label>
            <a 
              className="font-label-caps text-label-caps text-primary transition-colors" 
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Olvidé mi contraseña
            </a>
          </div>
          <div className="relative">
            <IonIcon 
              icon={lockClosedOutline} 
              className="absolute left-md top-1/2 -translate-y-1/2 text-outline text-xl" 
            />
            <input 
              className="w-full h-12 pl-11 pr-md rounded-card-lg border border-outline/20 bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm" 
              id="password" 
              placeholder="••••••••" 
              type={showPassword ? 'text' : 'password'}
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              aria-label="Toggle password visibility" 
              className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors flex items-center justify-center cursor-pointer" 
              type="button"
              disabled={loading}
              onClick={handleTogglePassword}
            >
              <IonIcon 
                icon={showPassword ? eyeOutline : eyeOffOutline} 
                className="text-xl" 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Submit Action */}
      <button 
        className="w-full h-12 bg-primary text-on-primary rounded-card-lg font-label-caps text-label-caps uppercase tracking-wider flex items-center justify-center gap-sm hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm mt-sm cursor-pointer" 
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <Spinner size="md" color="border-white" />
        ) : (
          <>
            Entrar
            <IonIcon icon={arrowForwardOutline} className="text-xl" />
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
