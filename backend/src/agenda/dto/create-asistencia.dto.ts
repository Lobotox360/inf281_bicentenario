import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAsistenciaDto {
  @IsString()
  @IsNotEmpty()
  id_usuario: string;

  @IsNumber()
  @IsNotEmpty()
  id_evento: number;
}
