import { IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTelefonoDto } from './create-telefono.dto';

export class CreateTelefonosDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTelefonoDto)
  telefonos: CreateTelefonoDto[];
}
