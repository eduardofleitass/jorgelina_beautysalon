import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservasModule } from './reservas/reservas.module';

@Module({
  imports: [ReservasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
