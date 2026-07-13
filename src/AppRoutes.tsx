import { useAuthMiddleware } from '@/services/authMiddleware';
import { isAuthenticated } from '@/services/authService';
import { IonContent, IonPage, IonRouterOutlet, IonSpinner } from '@ionic/react';
import React, { Suspense, lazy } from 'react';
import { Redirect, Route } from 'react-router-dom';

const Home = lazy(() => import('@/pages/Home'));
const Inventory = lazy(() => import('@/pages/Inventory'));
const Login = lazy(() => import('@/pages/Login'));
const Scanner = lazy(() => import('@/pages/Scanner'));
const Settings = lazy(() => import('@/pages/Settings'));

const PageLoader: React.FC = () => (
  <IonPage>
    <IonContent>
      <div className="absolute inset-0 flex items-center justify-center">
        <IonSpinner name="crescent" color="primary" />
      </div>
    </IonContent>
  </IonPage>
);

const AppRoutes: React.FC = () => {
  // Run the auth state middleware monitor
  useAuthMiddleware();

  return (
    <Suspense fallback={<PageLoader />}>
      <IonRouterOutlet>
        {/* Main Routes */}
        <Route exact path="/login">
          <Login />
        </Route>
        
        <Route exact path="/home" render={() => (
          isAuthenticated() ? <Home /> : <Redirect to="/login" />
        )} />

        <Route exact path="/inventory" render={() => (
          isAuthenticated() ? <Inventory /> : <Redirect to="/login" />
        )} />

        <Route exact path="/scanner" render={() => (
          isAuthenticated() ? <Scanner /> : <Redirect to="/login" />
        )} />

        <Route exact path="/settings" render={() => (
          isAuthenticated() ? <Settings /> : <Redirect to="/login" />
        )} />


        {/* Redirect empty path to login */}
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    </Suspense>
  );
};

export default AppRoutes;
