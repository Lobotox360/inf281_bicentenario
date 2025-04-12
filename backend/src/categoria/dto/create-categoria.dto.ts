import { IsString, IsOptional } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion?: string;
}