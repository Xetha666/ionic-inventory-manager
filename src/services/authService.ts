import { supabase } from './supabaseClient';

export interface UserSession {
  name: string;
  email: string;
  role: 'Administrador' | 'User';
}

export const getLocalUserSession = (): UserSession => {
  const sessionStr = localStorage.getItem('user_session');
  if (sessionStr) {
    try {
      return JSON.parse(sessionStr);
    } catch (e) {
      console.error('Error parsing user session:', e);
    }
  }
  // Default fallback
  return {
    name: 'Alejandro Moreno',
    email: 'admin@inventoryflow.com',
    role: 'Administrador',
  };
};

export const setLocalUserSession = (session: UserSession) => {
  localStorage.setItem('user_session', JSON.stringify(session));
  // Generate and save a mock JWT token representing the session
  const mockToken = `mock_jwt_token_${btoa(JSON.stringify(session))}_${Date.now()}`;
  localStorage.setItem('auth_token', mockToken);
};

export const clearLocalUserSession = () => {
  localStorage.removeItem('user_session');
  localStorage.removeItem('auth_token');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

/**
 * Perform a logout operation clearing both Supabase and LocalStorage session
 */
export const logoutUser = async () => {
  clearLocalUserSession();
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Supabase logout skipped or failed:', err);
  }
};
