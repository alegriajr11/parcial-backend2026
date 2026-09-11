import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAsistenteDto {
  @IsString({ message: 'El código del ticket debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código del ticket es obligatorio' })
  @MinLength(4, { message: 'El código del ticket debe tener mínimo 4 caracteres' })
  codigoTicket: string;

  @IsString({ message: 'El nombre completo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  nombreCompleto: string;

  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  correo: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsOptional()
  telefono?: string;

  @IsInt({ message: 'El eventoId debe ser un número entero' })
  @IsNotEmpty({ message: 'El eventoId es obligatorio para registrar al asistente' })
  eventoId: number;

}
