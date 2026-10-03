import { Injectable, Logger } from '@nestjs/common';
import { Reserva } from './reservas.service';

/**
 * Notificacion por WhatsApp via CallMeBot (API gratuita, uso personal).
 *
 * Requiere en backend/.env:
 *   CALLMEBOT_PHONE=595985853557
 *   CALLMEBOT_APIKEY=xxxxxx
 *
 * Si no estan configuradas, el envio se omite silenciosamente
 * (la reserva se guarda igual, nunca se pierde).
 */
@Injectable()
export class NotificacionService {
  private readonly logger = new Logger(NotificacionService.name);

  private get phone(): string | undefined {
    return process.env.CALLMEBOT_PHONE;
  }

  private get apikey(): string | undefined {
    return process.env.CALLMEBOT_APIKEY;
  }

  get configurado(): boolean {
    return Boolean(this.phone && this.apikey);
  }

  /** Construye el texto de la notificacion para el salon */
  private construirMensaje(reserva: Reserva): string {
    const lineas = [
      'NUEVA RESERVA - Jorgelina Coiffure',
      '',
      `Cliente: ${reserva.name}`,
      `Telefono: ${reserva.phone}`,
      `Servicio: ${reserva.service}`,
      `Fecha preferida: ${reserva.date || 'sin especificar'}`,
    ];
    if (reserva.message) {
      lineas.push(`Mensaje: ${reserva.message}`);
    }
    lineas.push('', `Reserva #${reserva.id}`);
    return lineas.join('\n');
  }

  /**
   * Envia la notificacion. NUNCA lanza excepcion:
   * el fallo de notificacion no debe romper el guardado de la reserva.
   */
  async notificarReserva(reserva: Reserva): Promise<boolean> {
    if (!this.configurado) {
      this.logger.warn(
        'CallMeBot no configurado (CALLMEBOT_PHONE/CALLMEBOT_APIKEY). Notificacion omitida.',
      );
      return false;
    }

    const texto = this.construirMensaje(reserva);
    const url =
      `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(this.phone!)}` +
      `&text=${encodeURIComponent(texto)}` +
      `&apikey=${encodeURIComponent(this.apikey!)}`;

    try {
      const respuesta = await fetch(url, { method: 'GET' });
      const cuerpo = await respuesta.text();

      if (!respuesta.ok) {
        this.logger.error(`CallMeBot respondio ${respuesta.status}: ${cuerpo.slice(0, 200)}`);
        return false;
      }

      this.logger.log(`Notificacion WhatsApp enviada para reserva #${reserva.id}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Error enviando notificacion WhatsApp: ${error instanceof Error ? error.message : error}`,
      );
      return false;
    }
  }
}
