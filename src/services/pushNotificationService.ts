import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { getLocalUserSession } from './authService';
import { supabase } from './supabaseClient';

// Almacenar el token en memoria para poder asociarlo al iniciar sesión
let cachedToken: string | null = null;

export const pushNotificationService = {
  /**
   * Inicializa los permisos y listeners de notificaciones push nativas si la app corre en un dispositivo móvil.
   */
  async register() {
    if (!Capacitor.isNativePlatform()) {
      console.log('Notificaciones push no disponibles en entorno web (Vite).');
      return;
    }

    try {
      // 1. Verificar estado actual de permisos
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('Permiso de notificaciones denegado por el usuario.');
        return;
      }

      // 2. Registrar el dispositivo con el servicio APNS/FCM de Android/iOS
      await PushNotifications.register();

      // 3. Listener: Dispara el token generado por Firebase
      await PushNotifications.addListener('registration', async (token: Token) => {
        console.log('FCM Device Token obtenido:', token.value);
        cachedToken = token.value;
        await this.saveTokenToSupabase(token.value);
      });

      // 4. Listener: Errores en la comunicación con Firebase
      await PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error durante el registro en Firebase FCM:', error);
      });

      // 5. Listener: Recibir una notificación con la app en primer plano 
      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Notificación push recibida en foreground:', notification);
      });

      // 6. Listener: Al hacer clic/tap en una notificación de la barra nativa
      await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('Acción sobre notificación push (usuario hizo clic):', action);
      });

    } catch (err) {
      console.error('Error al inicializar notificaciones push nativas:', err);
    }
  },

  /**
   * Asocia el token en cache con el usuario autenticado actualmente.
   * Se debe llamar tras un inicio de sesión exitoso.
   */
  async associateTokenWithUser() {
    if (cachedToken) {
      console.log('Asociando token FCM existente con el usuario actual...');
      await this.saveTokenToSupabase(cachedToken);
    }
  },

  /**
   * Desvincula el token actual del usuario al cerrar sesión (establece user_id a null)
   * para evitar seguir enviando alertas de su cuenta a este dispositivo.
   */
  async disassociateToken() {
    if (cachedToken) {
      try {
        console.log('Desvinculando token FCM del usuario...');
        const { error } = await supabase
          .from('device_tokens')
          .update({ user_id: null })
          .eq('token', cachedToken);

        if (error) {
          console.error('Error al desvincular token en Supabase:', error);
        }
      } catch (err) {
        console.error('Excepción al desvincular el token del dispositivo:', err);
      }
    }
  },

  /**
   * Guarda o actualiza el token del dispositivo en la tabla de Supabase, enlazándolo al usuario si está logueado.
   */
  async saveTokenToSupabase(token: string) {
    try {
      const session = getLocalUserSession();
      const userId = session?.id || null;

      const { error } = await supabase
        .from('device_tokens')
        .upsert(
          { 
            token: token, 
            device_model: 'Android',
            user_id: userId
          },
          { onConflict: 'token' }
        );

      if (error) {
        console.error('Error al persistir el Device Token en Supabase:', error);
      } else {
        console.log(`FCM Device Token registrado exitosamente. Usuario vinculado: ${userId || 'Ninguno (Anónimo)'}`);
      }
    } catch (err) {
      console.error('Excepción al registrar el token del dispositivo:', err);
    }
  }
};
