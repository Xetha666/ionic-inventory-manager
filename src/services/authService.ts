import { supabase } from './supabaseClient';

export interface UserSession {
  id?: string;
  name: string;
  email: string;
  role: 'Administrador' | 'User';
  avatarUrl?: string;
}

export const getLocalUserSession = (): UserSession | null => {
  const sessionStr = localStorage.getItem('user_session');
  if (sessionStr) {
    try {
      return JSON.parse(sessionStr);
    } catch (e) {
      console.error('Error parsing user session:', e);
    }
  }
  return null;
};

export const setLocalUserSession = (session: UserSession) => {
  localStorage.setItem('user_session', JSON.stringify(session));
  // Generate and save a mock JWT token representing the session
  const mockToken = `mock_jwt_token_${btoa(JSON.stringify(session))}_${Date.now()}`;
  localStorage.setItem('auth_token', mockToken);
};

export const updateLocalUserSession = (updates: Partial<UserSession>) => {
  const current = getLocalUserSession();
  if (current) {
    const updated = { ...current, ...updates };
    localStorage.setItem('user_session', JSON.stringify(updated));
  }
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

/**
 * Authenticates user with Supabase using email or username, fetches profile, and stores session
 */
export const loginWithCredentials = async (usernameInput: string, passwordInput: string): Promise<UserSession> => {
  const normalizedInput = usernameInput.trim();
  let resolvedEmail = normalizedInput;

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

  // 2. Perform authentication with Supabase
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: resolvedEmail,
    password: passwordInput,
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
  const session: UserSession = {
    id: authData.user.id,
    name: profile.full_name || 'Usuario',
    email: resolvedEmail,
    role: roleName as 'Administrador' | 'User',
    avatarUrl: profile.avatar_url || '/avatar.png',
  };

  // 4. Store session in localStorage (for application state)
  setLocalUserSession(session);

  return session;
};

