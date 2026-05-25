import { setLocalUserSession } from '@/services/authService';
import { IonIcon, useIonViewWillLeave } from '@ionic/react';
import { arrowForwardOutline, eyeOffOutline, eyeOutline, lockClosedOutline, personOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

interface LoginFormProps {
  onLogin?: (emailOrUsername: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  useIonViewWillLeave(() => {
    // Clear credentials for security when leaving the login page
    setUsername('');
    setPassword('');
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedInput = username.trim().toLowerCase();
    let resolvedEmail = normalizedInput;

    // Fallback/Resolve username to email mapping for testing and local flow
    if (normalizedInput === 'maria' || normalizedInput === 'maria@ejemplo.com') {
      resolvedEmail = 'maria@ejemplo.com';
      setLocalUserSession({
        name: 'María López',
        email: 'maria@ejemplo.com',
        role: 'User',
        avatarUrl: '/avatar.png',
      });
    } else {
      // Default to Juan Pérez (Administrador) for any other input (e.g. juan or juan@ejemplo.com)
      resolvedEmail = normalizedInput.includes('@') ? normalizedInput : `${normalizedInput}@ejemplo.com`;
      setLocalUserSession({
        name: 'Juan Pérez',
        email: resolvedEmail,
        role: 'Administrador',
        avatarUrl: '/avatar.png',
      });
    }

    if (onLogin) {
      onLogin(resolvedEmail, password);
    } else {
      console.log('Logging in with username/email:', resolvedEmail);
      history.push('/home');
    }
  };

  return (
    <form className="flex flex-col gap-md sm:gap-lg relative z-10" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-sm sm:gap-stack-gap">
        {/* Username Input */}
        <div className="flex flex-col gap-xs">
          <label 
            className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider ml-xs" 
            htmlFor="username"
          >
            Nombre de Usuario
          </label>
          <div className="relative">
            <IonIcon 
              icon={personOutline} 
              className="absolute left-md top-1/2 -translate-y-1/2 text-outline text-xl" 
            />
            <input 
              className="w-full h-12 pl-11 pr-md rounded-card-lg border border-outline/20 bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm" 
              id="username" 
              placeholder="juanperez" 
              type="text"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              aria-label="Toggle password visibility" 
              className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors flex items-center justify-center cursor-pointer" 
              type="button"
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
      <button className="w-full h-12 bg-primary text-on-primary rounded-card-lg font-label-caps text-label-caps uppercase tracking-wider flex items-center justify-center gap-sm hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm mt-sm cursor-pointer" type="submit">
        Entrar
        <IonIcon icon={arrowForwardOutline} className="text-xl" />
      </button>

      {/* Access Hints */}
      <div className="p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/20 flex flex-col gap-xs text-[11px] text-outline mt-xs">
        <span className="font-bold uppercase tracking-wider text-on-surface-variant mb-1">Usuarios de prueba:</span>
        <div className="flex justify-between items-center">
          <span>🔑 Administrador:</span>
          <span className="font-semibold text-primary">juan</span>
        </div>
        <div className="flex justify-between items-center">
          <span>🔑 Usuario Común:</span>
          <span className="font-semibold text-primary">maria</span>
        </div>
        <span className="text-[10px] text-outline-variant mt-1.5 text-center">(Contraseña: cualquiera)</span>
      </div>
    </form>
  );
};

export default LoginForm;
