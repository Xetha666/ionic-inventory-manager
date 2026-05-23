import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Settings from '@/pages/Settings';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useHistory } from 'react-router-dom';
import React, { useEffect } from 'react';
import { isAuthenticated, clearLocalUserSession } from '@/services/authService';
import { supabase } from '@/services/supabaseClient';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
/* import '@ionic/react/css/palettes/dark.system.css'; */

/* Theme variables */
import '@/theme/variables.css';

setupIonicReact();

// Active watcher to monitor session tokens and Supabase auth changes
const AuthWatcher: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    // 1. Listen to Supabase auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        clearLocalUserSession();
        history.push('/login');
      }
    });

    // 2. Listen to tab storage changes (logs out user if token is deleted in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' && !e.newValue) {
        clearLocalUserSession();
        history.push('/login');
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [history]);

  return null;
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AuthWatcher />
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
    </IonReactRouter>
  </IonApp>
);

export default App;
