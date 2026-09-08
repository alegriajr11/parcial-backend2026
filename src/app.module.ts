import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { EventosModule } from './eventos/eventos.module';
import { AsistentesModule } from './asistentes/asistentes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    EventosModule,
    AsistentesModule,
  ],
})
export class AppModule {}
