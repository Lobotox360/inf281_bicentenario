// src/ubicacion/dto/update-ubicacion.dto.ts
import { IsString, IsOptional ,IsNumber} from 'class-validator';

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

  @IsOptional()
  @IsNumber() 
  latitud: number;

  @IsOptional()
  @IsNumber() 
  longitud: number;
}
