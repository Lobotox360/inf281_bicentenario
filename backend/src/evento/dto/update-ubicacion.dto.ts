// src/ubicacion/dto/update-ubicacion.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateUbicacionDto {
  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsString()
  departamento?: string;
}
