import Spinner from '@/components/common/Spinner';
import { useLoginForm } from '@/hooks/useLoginForm';
import { IonAlert, IonIcon } from '@ionic/react';
import { arrowForwardOutline, eyeOffOutline, eyeOutline, lockClosedOutline, personOutline } from 'ionicons/icons';
import React from 'react';

const LoginForm: React.FC = () => {
  const { username, setUsername, password, setPassword, showPassword, error, loading, enrollPromptOpen, handleTogglePassword, handleEnrollResponse, handleSubmit } = useLoginForm();

  return (
    <>
      <form className="flex flex-col gap-md sm:gap-lg relative z-10" onSubmit={handleSubmit}>
        {error && (
          <div className="p-4 rounded-2xl text-sm font-medium border bg-error/10 border-error/20 text-error shrink-0">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-sm sm:gap-stack-gap">
          {/* Username */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider ml-xs" htmlFor="username">Usuario</label>
            <div className="relative">
              <IonIcon icon={personOutline} className="absolute left-md top-1/2 -translate-y-1/2 text-outline text-xl" />
              <input className="w-full h-12 pl-11 pr-md rounded-card-lg border border-outline/20 bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm" id="username" placeholder="Ingrese su usuario" type="text" required disabled={loading} value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-xs">
            <div className="flex justify-between items-center ml-xs mr-xs">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="password">Contraseña</label>            
            </div>
            <div className="relative">
              <IonIcon icon={lockClosedOutline} className="absolute left-md top-1/2 -translate-y-1/2 text-outline text-xl" />
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
        <button className="w-full h-12 bg-primary text-on-primary rounded-card-lg font-label-caps text-label-caps uppercase tracking-wider flex items-center justify-center gap-sm hover:bg-primary/90 active:scale-95 transition-all shadow-sm mt-sm cursor-pointer" type="submit" disabled={loading}>
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

      {/* Biometric Enrollment Prompt */}
      <IonAlert
        isOpen={enrollPromptOpen}
        header="Inicio de sesión biométrico"
        message="¿Deseas activar el inicio de sesión con huella dactilar o Face ID para la próxima vez?"
        buttons={[
          {
            text: 'Ahora no',
            role: 'cancel',
            handler: () => handleEnrollResponse(false),
          },
          {
            text: 'Activar',
            handler: () => handleEnrollResponse(true),
          },
        ]}
      />
    </>
  );
};

export default LoginForm;
