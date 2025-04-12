import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PatrocinadorService } from './patrocinador.service';
import { CreatePatrocinadorDto } from './dto/create-patrocinador.dto';
import { UpdatePatrocinadorDto } from './dto/update-patrocinador.dto';

@Controller('evento/patrocinador')
export class PatrocinadorController {
  constructor(private readonly patrocinadorService: PatrocinadorService) {}

  @Post()
  create(@Body() data: CreatePatrocinadorDto) {
    return this.patrocinadorService.create(data);
  }

  @Get()
  findAll() {
    return this.patrocinadorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patrocinadorService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdatePatrocinadorDto,
  ) {
    return this.patrocinadorService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patrocinadorService.remove(+id);
  }
}
