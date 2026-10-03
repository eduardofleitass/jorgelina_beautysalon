import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { ReservasService, Reserva } from './reservas.service';

@Controller('api/reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Get()
  findAll(): Reserva[] {
    return this.reservasService.findAll();
  }

  @Get('count')
  count(): { total: number } {
    return { total: this.reservasService.count() };
  }

  @Post()
  create(@Body() body: Partial<Reserva>): Reserva {
    if (!body.name || !body.phone || !body.service) {
      throw new BadRequestException('Nombre, telefono y servicio son obligatorios');
    }
    return this.reservasService.create({
      name: body.name,
      phone: body.phone,
      service: body.service,
      date: body.date || '',
      message: body.message || '',
    });
  }
}
