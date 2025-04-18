import { IsString, IsNumber, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateAgendaDto {
  @IsString()
  id_usuario: string;

  @IsNumber()
  id_evento: number;

  // Campo para el comentario, opcional
  @IsOptional()
  @IsString()
  comentario?: string;

  // Campo para la calificación, opcional
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  calificacion?: number;
}
