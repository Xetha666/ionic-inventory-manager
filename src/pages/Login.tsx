import BiometricAuth from '@/components/login/BiometricAuth';
import LoginForm from '@/components/login/LoginForm';
import LoginHeader from '@/components/login/LoginHeader';
import { loginWithBiometric } from '@/services/biometricService';
import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const history = useHistory();
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometricError, setBiometricError] = useState<string | null>(null);

  const handleBiometricLogin = async () => {
    setBiometricLoading(true);
    setBiometricError(null);
    try {
      await loginWithBiometric();
      history.push('/home');
    } catch (err: any) {
      console.error('Biometric login error:', err.message);
      setBiometricError(err.message || 'Error al autenticar.');
    } finally {
      setBiometricLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent scrollY={false}>
        <div className="h-full min-h-full flex items-center justify-center p-0 sm:p-container-padding bg-surface font-body-md text-on-background antialiased selection:bg-primary/20 selection:text-primary">
          <main className="w-full max-w-login-card h-full sm:h-auto bg-surface sm:bg-surface-container-lowest rounded-none sm:rounded-login-card p-lg sm:p-xl shadow-none sm:shadow-login border-0 sm:border border-outline-variant/30 flex flex-col justify-center sm:justify-start relative overflow-hidden my-0 sm:my-lg">
            {/* Subtle Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary-fixed/20 blur-3xl rounded-full pointer-events-none"></div>

            <LoginHeader />

            <LoginForm />

            <BiometricAuth 
              onFingerprintClick={handleBiometricLogin}
              onFaceIdClick={handleBiometricLogin}
              loading={biometricLoading}
              error={biometricError}
            />
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
