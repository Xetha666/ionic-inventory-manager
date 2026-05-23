import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { supabase } from '@/services/supabaseClient';
import { clearLocalUserSession } from '@/services/authService';

/**
 * Custom hook acting as a client-side middleware to monitor authentication states.
 * It auto-logs out and redirects to /login on token expiration, signOut, or cross-tab token removal.
 */
export const useAuthMiddleware = () => {
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
};
