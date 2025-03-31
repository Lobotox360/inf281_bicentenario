import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  apellidopaterno: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  apellidomaterno: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  contrasena: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  telefono: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  pais: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  ciudad: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  genero: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  foto?: string;

}
