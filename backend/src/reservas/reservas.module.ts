import { Module } from '@nestjs/common';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { NotificacionService } from './notificacion.service';

@Module({
  controllers: [ReservasController],
  providers: [ReservasService, NotificacionService],
})
export class ReservasModule {}
