/**
 * Resolucion centralizada de la URL del backend.
 * - Produccion (mismo origen): usa el origin actual.
 * - Desarrollo (Vite 5173/5174) o Electron (file://): localhost:3001
 */
const PUERTO_LOCAL = '3001';

function resolverApiUrl(): string {
  const desdeEnv = import.meta.env?.VITE_API_URL;
  if (typeof desdeEnv === 'string' && desdeEnv.trim()) {
    return desdeEnv.trim().replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    const { protocol, origin } = window.location;
    if ((protocol === 'http:' || protocol === 'https:') && origin && !/:517[34]$/.test(origin)) {
      return origin;
    }
  }
  return `http://localhost:${PUERTO_LOCAL}`;
}

export const API_URL = resolverApiUrl();

export function api(ruta: string): string {
  return `${API_URL}${ruta.startsWith('/') ? ruta : `/${ruta}`}`;
}
