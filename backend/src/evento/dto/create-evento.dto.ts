import {
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsNumber()
  @Type(() => Number)
  categoria: number;

  @IsNumber()
  @Type(() => Number)
  patrocinador: number;

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
