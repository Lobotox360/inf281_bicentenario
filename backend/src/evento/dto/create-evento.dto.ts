import {
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
class CategoriaDto {
  @IsNumber()
  id_categoria: number;
}

// Modificar para recibir un array de objetos con `id_auspiciador`
class PatrocinadorDto {
  @IsNumber()
  id_auspiciador: number;
}
class TelefonosContactoDto {
  @IsString()
  telefono1: string;

  @IsString()
  telefono2: string;
}

class ExpositorDto {
  @IsString()
  nombre: string;

  @IsString()
  especialidad: string;

  @IsString()
  institucion: string;

  @IsString()
  contacto: string;
}

class UbicacionDto {
  @IsString()
  ubicacion: string;

  @IsString()
  departamento: string;

  @IsString()
  descripcion: string;

  @IsString()
  latitud: number;

  @IsString()
  longitud: number;
}

export class CreateEventoDto {
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsString()
  foto_evento?: string;

  @IsString()
  hora_inicio: string;

  @IsString()
  hora_fin: string;

  @IsNumber()
  @Type(() => Number)
  costo: number;

  @IsString()
  modalidad: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoriaDto)
  categoria: CategoriaDto[];

  // Cambiar a un array de objetos con `id_auspiciador`
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatrocinadorDto)
  patrocinador: PatrocinadorDto[];

  @ValidateNested()
  @Type(() => TelefonosContactoDto)
  telefonos_contacto: TelefonosContactoDto;

  @ValidateNested()
  @Type(() => ExpositorDto)
  expositor: ExpositorDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UbicacionDto)
  ubicacion: UbicacionDto[];
}
