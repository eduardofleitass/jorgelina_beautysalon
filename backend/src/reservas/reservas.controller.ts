import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { ReservasService, Reserva } from './reservas.service';
import { NotificacionService } from './notificacion.service';

@Controller('api/reservas')
export class ReservasController {
  constructor(
    private readonly reservasService: ReservasService,
    private readonly notificacionService: NotificacionService,
  ) {}

  @Get()
  findAll(): Reserva[] {
    return this.reservasService.findAll();
  }

  @Get('count')
  count(): { total: number } {
    return { total: this.reservasService.count() };
  }

  @Get('notificacion-estado')
  estadoNotificacion(): { configurado: boolean } {
    return { configurado: this.notificacionService.configurado };
  }

  @Post()
  async create(@Body() body: Partial<Reserva>): Promise<Reserva & { notificado: boolean }> {
    if (!body.name || !body.phone || !body.service) {
      throw new BadRequestException('Nombre, telefono y servicio son obligatorios');
    }

    const reserva = this.reservasService.create({
      name: body.name,
      phone: body.phone,
      service: body.service,
      date: body.date || '',
      message: body.message || '',
    });

    // Notificacion al WhatsApp del salon (no bloquea ni rompe el guardado)
    const notificado = await this.notificacionService.notificarReserva(reserva);

    return { ...reserva, notificado };
  }
}
