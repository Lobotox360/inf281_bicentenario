import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateExpositorDto {
  @IsInt()
  @IsNotEmpty()
  id_evento: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  especialidad: string;

  @IsString()
  @IsNotEmpty()
  institucion: string;

  @IsString()
  @IsNotEmpty()
  contacto: string;
}
