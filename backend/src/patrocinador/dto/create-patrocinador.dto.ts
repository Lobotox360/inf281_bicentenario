import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePatrocinadorDto {
  @IsString()
  @IsNotEmpty()
  razon_social: string;

  @IsString()
  @IsNotEmpty()
  institucion: string;
}