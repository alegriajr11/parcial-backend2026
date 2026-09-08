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

  await app.listen(3000);
  console.log(`🚀 Servidor ejecutándose en http://localhost:3000/api`);
}
bootstrap();
