import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTelefonoDto {
  @IsNumber()
  @IsNotEmpty()
  id_evento: number;

  @IsNumber()
  @IsNotEmpty()
  id_telefono: number;  // Agregar esta propiedad

  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;
}
