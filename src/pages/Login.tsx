import BiometricAuth from '@/components/Login/BiometricAuth';
import LoginForm from '@/components/Login/LoginForm';
import LoginHeader from '@/components/Login/LoginHeader';
import { IonContent, IonPage } from '@ionic/react';
import React from 'react';

const Login: React.FC = () => {
  const handleFingerprintClick = () => {
    console.log('Biometric Login: Fingerprint');
    // Implement fingerprint biometric action
  };

  const handleFaceIdClick = () => {
    console.log('Biometric Login: Face ID');
    // Implement Face ID biometric action
  };

  return (
    <IonPage>
      <IonContent className="ion-no-padding" scrollY={true}>
        <div className="h-full min-h-full flex items-center justify-center p-0 sm:p-container-padding pt-safe pb-safe bg-surface font-body-md text-on-background antialiased selection:bg-primary/20 selection:text-primary">
          <main className="w-full max-w-login-card h-full sm:h-auto bg-surface sm:bg-surface-container-lowest rounded-none sm:rounded-login-card p-lg sm:p-xl shadow-none sm:shadow-login border-0 sm:border border-outline-variant/30 flex flex-col justify-center sm:justify-start relative overflow-hidden my-0 sm:my-lg">
            {/* Subtle Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary-fixed/20 blur-3xl rounded-full pointer-events-none"></div>
            
            {/* Header Component */}
            <LoginHeader />

            {/* Form Component */}
            <LoginForm />

            {/* Biometric Authentication Component */}
            <BiometricAuth 
              onFingerprintClick={handleFingerprintClick}
              onFaceIdClick={handleFaceIdClick}
            />
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
