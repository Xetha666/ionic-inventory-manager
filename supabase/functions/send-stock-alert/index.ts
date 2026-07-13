import "./deno.d.ts";

import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { createClient } from "npm:@supabase/supabase-js@2.21.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FIREBASE_SERVICE_ACCOUNT = Deno.env.get("FIREBASE_SERVICE_ACCOUNT")!;

interface FirebaseServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain?: string;
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    console.log("Webhook payload recibido:", payload);

    // El payload del Webhook de Supabase contiene:
    // - record: el nuevo estado de la fila
    // - old_record: el estado anterior
    const product = payload.record;
    const oldProduct = payload.old_record;

    if (!product) {
      return new Response("No hay registro en el payload.", { status: 400 });
    }

    // Verificar si el stock es crítico (<= 5)
    // Y asegurarnos de notificar sólo si el stock disminuyó o es una inserción de stock crítico
    const isCritical = product.stock <= 5;
    const wasNotCriticalBefore = !oldProduct || oldProduct.stock > 5 || oldProduct.stock !== product.stock;

    if (!isCritical || !wasNotCriticalBefore) {
      console.log(`No se requiere notificación para "${product.name}". Stock actual: ${product.stock}`);
      return new Response("No se requiere notificación (stock no es crítico o no cambió).", { status: 200 });
    }

    // 1. Decodificar la Service Account de Firebase
    if (!FIREBASE_SERVICE_ACCOUNT) {
      throw new Error("La variable de entorno FIREBASE_SERVICE_ACCOUNT no está configurada.");
    }
    const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT) as FirebaseServiceAccount;
    
    // 2. Obtener Token de Acceso OAuth2 de Google
    const accessToken = await getGoogleAccessToken(serviceAccount);

    // 3. Crear cliente administrativo de Supabase
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 4. Obtener todos los Device Tokens activos
    const { data: deviceTokens, error: dbError } = await supabaseClient
      .from("device_tokens")
      .select("token");

    if (dbError) {
      throw dbError;
    }

    if (!deviceTokens || deviceTokens.length === 0) {
      console.log("No hay dispositivos Android registrados en 'device_tokens'.");
      return new Response("No hay dispositivos registrados.", { status: 200 });
    }

    console.log(`Enviando notificación push a ${deviceTokens.length} dispositivos para el producto "${product.name}".`);

    // 5. Enviar mensaje FCM a cada dispositivo
    const projectId = serviceAccount.project_id;
    const sendPromises = deviceTokens.map(async ({ token }) => {
      const messageBody = {
        message: {
          token: token,
          notification: {
            title: "⚠️ Alerta de Stock Crítico",
            body: `El producto "${product.name}" ha alcanzado un nivel crítico. Stock actual: ${product.stock} unidades.`,
          },
          data: {
            productId: product.id,
            category: product.category,
            stock: String(product.stock),
          }
        }
      };

      const res = await fetch(
        `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify(messageBody),
        }
      );

      const result = await res.json();
      console.log(`Respuesta FCM para token (${token.substring(0, 8)}...):`, result);

      // Si Firebase indica que el token ya no es válido o está desregistrado (status 404 o UNREGISTERED)
      if (res.status === 404 || (result.error && (result.error.status === 'UNREGISTERED' || result.error.message?.includes('not registered')))) {
        console.log(`Token obsoleto detectado. Eliminando de la base de datos: ${token.substring(0, 8)}...`);
        await supabaseClient
          .from("device_tokens")
          .delete()
          .eq("token", token);
      }

      return result;
    });

    await Promise.all(sendPromises);

    return new Response(JSON.stringify({ success: true, count: deviceTokens.length }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Error al procesar notificación push:", err);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

/**
 * Genera un token de acceso OAuth2 para las APIs de Google mediante Deno JWT.
 */
async function getGoogleAccessToken(serviceAccount: FirebaseServiceAccount): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;

  const jwtPayload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    exp,
    iat,
  };

  const keyPem = serviceAccount.private_key;
  const cryptoKey = await importPrivateKey(keyPem);

  // Firmar el JWT usando algoritmo RS256
  const jwt = await create({ alg: "RS256", typ: "JWT" }, jwtPayload, cryptoKey);

  // Solicitar token a OAuth2 de Google
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`Error en Google OAuth: ${data.error_description || data.error}`);
  }

  return data.access_token;
}

/**
 * Importa una clave privada PEM de PKCS#8 a un formato CryptoKey de Web Crypto.
 */
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";

  const pemContents = pem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\s/g, "");

  const binaryDerString = atob(pemContents);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }

  return await crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    true,
    ["sign"]
  );
}
