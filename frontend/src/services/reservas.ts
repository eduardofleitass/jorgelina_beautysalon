import { api } from '../config/api';

export interface ReservaPayload {
  name: string;
  phone: string;
  service: string;
  date?: string;
  message?: string;
}

export async function crearReserva(payload: ReservaPayload): Promise<{ id: number }> {
  const respuesta = await fetch(api('/api/reservas'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({}));
    throw new Error(error.message || 'No se pudo enviar la reserva');
  }

  return respuesta.json();
}
