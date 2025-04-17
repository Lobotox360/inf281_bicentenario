import { IsString, isNumber, IsDateString, IsNumber } from 'class-validator';

export class CreateAgendaDto {
  @IsString()
  id_usuario: string;

  @IsNumber()
  id_evento: number;

  @IsString()
  actividades: string;

  @IsDateString()
  fecha: string;
}
