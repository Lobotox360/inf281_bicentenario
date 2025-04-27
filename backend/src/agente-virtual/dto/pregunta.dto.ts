

import { IsString } from 'class-validator';

export class PreguntaDto {
  @IsString()
  pregunta: string;
}
