import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  apellidoPaterno: string;

  @IsNotEmpty()
  apellidoMaterno: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  contrasena: string;

  @IsOptional()
  telefono?: string;

  @IsNotEmpty()
  pais: string;

  @IsNotEmpty()
  ciudad: string;

  @IsOptional()
  genero?: string;
}
