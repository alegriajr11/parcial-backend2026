import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateEventoDto {
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título del evento es obligatorio' })
  @MinLength(3, { message: 'El título debe tener mínimo 3 caracteres' })
  titulo: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  descripcion?: string;

  @IsInt({ message: 'El cupo máximo debe ser un número entero' })
  @IsPositive({ message: 'El cupo máximo debe ser mayor a 0' })
  @Min(1, { message: 'El cupo mínimo permitido es 1' })
  cupoMaximo: number;

  @IsString({ message: 'El estado debe ser una cadena de texto' })
  @IsOptional()
  estado?: string;
}
