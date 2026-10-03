/**
 * Resolucion centralizada de la URL del backend.
 *
 * Funciona en los 3 escenarios sin tocar codigo:
 *  - Desarrollo (Vite):        -> http://localhost:3001
 *  - Servidor / red local:     -> mismo origen (el backend sirve el frontend)
 *  - Electron (file://):       -> http://localhost:3001
 *
 * Se usa la bandera real de Vite (import.meta.env.DEV) en vez de adivinar
 * el puerto del dev server, que puede cambiar (5173/5174/5175).
 */
const PUERTO_LOCAL = '3001';

function origenLocal(): string {
  return `http://localhost:${PUERTO_LOCAL}`;
}

function resolverApiUrl(): string {
  // 1. Override explicito en build time
  const desdeEnv = import.meta.env?.VITE_API_URL;
  if (typeof desdeEnv === 'string' && desdeEnv.trim()) {
    return desdeEnv.trim().replace(/\/+$/, '');
  }

  // 2. Desarrollo con Vite -> backend aparte en localhost
  if (import.meta.env?.DEV) {
    return origenLocal();
  }

  // 3. Servido por el backend (http/https) -> mismo origen
  if (typeof window !== 'undefined') {
    const { protocol, origin } = window.location;
    if ((protocol === 'http:' || protocol === 'https:') && origin) {
      return origin;
    }
  }

  // 4. Electron / file://
  return origenLocal();
}

export const API_URL = resolverApiUrl();

export function api(ruta: string): string {
  return `${API_URL}${ruta.startsWith('/') ? ruta : `/${ruta}`}`;
}
