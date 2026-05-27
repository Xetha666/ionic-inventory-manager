import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Settings from '@/pages/Settings';
import { useAuthMiddleware } from '@/services/authMiddleware';
import { isAuthenticated } from '@/services/authService';
import { IonRouterOutlet } from '@ionic/react';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const AppRoutes: React.FC = () => {
  // Run the auth state middleware monitor
  useAuthMiddleware();

  return (
    <IonRouterOutlet>
      {/* Main Routes */}
      <Route exact path="/login">
        <Login />
      </Route>
      
      <Route exact path="/home" render={() => (
        isAuthenticated() ? <Home /> : <Redirect to="/login" />
      )} />

      <Route exact path="/settings" render={() => (
        isAuthenticated() ? <Settings /> : <Redirect to="/login" />
      )} />

      {/* Redirect empty path to login */}
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
    </IonRouterOutlet>
  );
};

export default AppRoutes;
