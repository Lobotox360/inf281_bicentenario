import { IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExpositorDto } from './create-expositor.dto';

export class CreateExpositoresDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) 
  @Type(() => CreateExpositorDto)
  expositores: CreateExpositorDto[];
}
