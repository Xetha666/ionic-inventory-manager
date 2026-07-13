/**
 * Declaraciones de tipos mínimas para Deno runtime.
 * Esto permite que editores sin la extensión Deno reconozcan las APIs globales.
 */

declare namespace Deno {
  /** Obtiene el valor de una variable de entorno. */
  interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    has(key: string): boolean;
    toObject(): Record<string, string>;
  }

  export const env: Env;

  /** Inicia un servidor HTTP con el handler proporcionado. */
  export function serve(
    handler: (request: Request, info?: ServeHandlerInfo) => Response | Promise<Response>,
    options?: ServeOptions,
  ): HttpServer;

  export interface ServeOptions {
    port?: number;
    hostname?: string;
    signal?: AbortSignal;
    onListen?: (params: { hostname: string; port: number }) => void;
    onError?: (error: unknown) => Response | Promise<Response>;
  }

  export interface ServeHandlerInfo {
    remoteAddr: {
      hostname: string;
      port: number;
      transport: "tcp" | "udp";
    };
  }

  export interface HttpServer {
    finished: Promise<void>;
    ref(): void;
    unref(): void;
    shutdown(): Promise<void>;
  }
}

// Declaraciones de módulos para imports con protocolos de Deno
declare module "npm:@supabase/supabase-js@2.21.0" {
  export { createClient, SupabaseClient } from "@supabase/supabase-js";
}

declare module "https://deno.land/x/djwt@v2.8/mod.ts" {
  export function create(
    header: { alg: string; typ?: string },
    payload: Record<string, unknown>,
    key: CryptoKey,
  ): Promise<string>;

  export function verify(
    jwt: string,
    key: CryptoKey,
  ): Promise<Record<string, unknown>>;
}
