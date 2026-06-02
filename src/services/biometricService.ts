import { Preferences } from '@capacitor/preferences';
import { isPlatform } from '@ionic/react';
import { loginWithCredentials, UserSession } from './authService';
import { supabase } from './supabaseClient';

const BIOMETRIC_CREDENTIALS_KEY = 'biometric_credentials';

interface BiometricCredentials {
  email: string;
  password: string;
  token: string;
}

// ─── Storage Helpers ────────────────────────────────────────────────────────

const isNative = () => isPlatform('capacitor');

const saveCredentials = async (credentials: BiometricCredentials): Promise<void> => {
  const value = JSON.stringify(credentials);
  if (isNative()) {
    await Preferences.set({ key: BIOMETRIC_CREDENTIALS_KEY, value });
  } else {
    localStorage.setItem(BIOMETRIC_CREDENTIALS_KEY, value);
  }
};

const loadCredentials = async (): Promise<BiometricCredentials | null> => {
  let value: string | null = null;
  if (isNative()) {
    const result = await Preferences.get({ key: BIOMETRIC_CREDENTIALS_KEY });
    value = result.value;
  } else {
    value = localStorage.getItem(BIOMETRIC_CREDENTIALS_KEY);
  }
  if (!value) return null;
  try {
    return JSON.parse(value) as BiometricCredentials;
  } catch {
    return null;
  }
};

const removeCredentials = async (): Promise<void> => {
  if (isNative()) {
    await Preferences.remove({ key: BIOMETRIC_CREDENTIALS_KEY });
  } else {
    localStorage.removeItem(BIOMETRIC_CREDENTIALS_KEY);
  }
};

// ─── Native Biometric Prompt ────────────────────────────────────────────────

/**
 * Triggers the device biometric prompt (fingerprint or Face ID).
 * On web (dev mode), shows a window.confirm dialog to simulate the hardware scan.
 * Returns true if the user passed/accepted, false if they cancelled or failed.
 */
const promptBiometric = async (reason: string): Promise<boolean> => {
  if (!isNative()) {
    // Web simulation: just confirm to simulate a successful biometric scan
    return window.confirm(`[Simulación de escáner biométrico]\n${reason}\n\nPresiona Aceptar para simular un escaneo exitoso.`);
  }

  // On native: use the Capacitor BiometricAuth plugin
  // Dynamic import to avoid crashing on web where the plugin is absent
  try {
    const { BiometricAuth } = await import('@aparajita/capacitor-biometric-auth' as any);
    await BiometricAuth.authenticate({
      reason,
      cancelTitle: 'Cancelar',
      allowDeviceCredential: false,
    });
    return true;
  } catch {
    return false;
  }
};

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Checks if biometric credentials are stored on this device.
 */
export const hasStoredBiometricCredentials = async (): Promise<boolean> => {
  const creds = await loadCredentials();
  return creds !== null;
};

/**
 * Enrolls biometric auth for the current user.
 * 1. Triggers biometric prompt so the user authorises the enrollment.
 * 2. Generates a UUID token and stores credentials securely on the device.
 * 3. Updates the user's profile in Supabase (biometrics_enabled, biometric_token_id).
 */
export const enrollBiometric = async (
  userId: string,
  email: string,
  password: string,
): Promise<void> => {
  const confirmed = await promptBiometric('Confirma tu identidad para activar el inicio de sesión biométrico.');
  if (!confirmed) {
    throw new Error('Enrolamiento cancelado por el usuario.');
  }

  const token = crypto.randomUUID();

  await saveCredentials({ email, password, token });

  const { error } = await supabase
    .from('profiles')
    .update({
      biometrics_enabled: true,
      biometric_token_id: token,
    })
    .eq('id', userId);

  if (error) {
    // Rollback local credentials if DB update fails
    await removeCredentials();
    throw new Error('No se pudo activar la biometría en el servidor.');
  }
};

/**
 * Logs in using stored biometric credentials.
 * 1. Loads stored credentials from the device.
 * 2. Triggers the biometric prompt.
 * 3. Validates the stored token against Supabase before authenticating.
 * 4. Returns the full UserSession on success.
 */
export const loginWithBiometric = async (): Promise<UserSession> => {
  const credentials = await loadCredentials();
  if (!credentials) {
    if (!isNative()) {
      const bypass = window.confirm(
        'No hay credenciales biométricas guardadas en este navegador.\n\n¿Deseas saltar la validación e ingresar credenciales manualmente para guardarlas y activar la biometría en la base de datos?'
      );
      if (bypass) {
        const email = window.prompt('Ingresa tu correo o usuario:');
        if (!email) throw new Error('Usuario/correo cancelado.');
        const password = window.prompt('Ingresa tu contraseña:');
        if (!password) throw new Error('Contraseña cancelada.');

        const session = await loginWithCredentials(email, password);
        if (session.id) {
          const token = crypto.randomUUID();
          await saveCredentials({ email, password, token });
          
          await supabase
            .from('profiles')
            .update({
              biometrics_enabled: true,
              biometric_token_id: token,
            })
            .eq('id', session.id);
        }
        return session;
      }
    }
    throw new Error('No hay credenciales biométricas registradas en este dispositivo.');
  }

  const confirmed = await promptBiometric('Verifica tu identidad para iniciar sesión.');
  if (!confirmed) {
    throw new Error('Autenticación biométrica cancelada.');
  }

  // On Web, ask if user wants to bypass/simulate the database validation
  let skipDbCheck = false;
  if (!isNative()) {
    skipDbCheck = window.confirm(
      '¿Deseas saltar la validación de la base de datos y forzar la activación biométrica en la base de datos?'
    );
  }

  if (skipDbCheck) {
    const session = await loginWithCredentials(credentials.email, credentials.password);
    if (session.id) {
      await supabase
        .from('profiles')
        .update({
          biometrics_enabled: true,
          biometric_token_id: credentials.token,
        })
        .eq('id', session.id);
    }
    return session;
  }

  // Validate token against the DB before authenticating
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, biometrics_enabled, biometric_token_id')
    .eq('biometric_token_id', credentials.token)
    .single();

  if (error || !profile) {
    // Token mismatch — credentials may be stale (e.g. enrolled on another device)
    await removeCredentials();
    throw new Error('Este dispositivo ya no está autorizado para inicio de sesión biométrico. Por favor, inicia sesión con tu contraseña.');
  }

  if (!profile.biometrics_enabled) {
    await removeCredentials();
    throw new Error('La autenticación biométrica está desactivada. Por favor, inicia sesión con tu contraseña.');
  }

  return await loginWithCredentials(credentials.email, credentials.password);
};

/**
 * Removes biometric enrollment for the current user.
 * Clears device credentials and resets the profile columns in Supabase.
 */
export const unenrollBiometric = async (userId: string): Promise<void> => {
  await removeCredentials();
  const { error } = await supabase
    .from('profiles')
    .update({
      biometrics_enabled: false,
      biometric_token_id: null,
    })
    .eq('id', userId);

  if (error) {
    throw new Error('No se pudo desactivar la biometría en el servidor.');
  }
};
