import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsistentesService } from './asistentes.service';
import { AsistentesController } from './asistentes.controller';
import { Asistente } from './entities/asistente.entity';
import { EventosModule } from '../eventos/eventos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asistente]),
    EventosModule, // Importamos EventosModule para poder inyectar EventosService
  ],
  controllers: [AsistentesController],
  providers: [AsistentesService],
})
export class AsistentesModule {}
