import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global estricta de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve datos que no estén definidos en el DTO
      forbidNonWhitelisted: true, // Lanza error 400 Bad Request si envían campos no permitidos
      transform: true, // Transforma tipos automáticamente (strings a números, etc.)
    }),
  );

  // Prefijo global para la API REST
  app.setGlobalPrefix('api');

  // Lectura del puerto dinámico desde ConfigService / .env
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);
  console.log(`🚀 Servidor ejecutándose en http://localhost:${port}/api`);
}
bootstrap();
