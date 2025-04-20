import { Controller, Get, Post, Body, UseGuards, Param, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { PatrocinadorService } from './patrocinador.service';
import { CreatePatrocinadorDto } from './dto/create-patrocinador.dto';
import { UpdatePatrocinadorDto } from './dto/update-patrocinador.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CasbinGuard } from '../rbac/casbin.guard';

@Controller('evento/patrocinador')
export class PatrocinadorController {
  constructor(private readonly patrocinadorService: PatrocinadorService) {}

  // edita la relacion patrocinador_evento
  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Put('evento/:id_evento')
  async updatePatrocinadoresEvento(
    @Param('id_evento') id_evento: string, 
    @Body() patrocinadores: { id_patrocinador: number }[]
  ) {
    const eventoId = parseInt(id_evento, 10);

    if (isNaN(eventoId)) {
      throw new HttpException(
        'El id_evento debe ser un número válido',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.patrocinadorService.updatePatrocinadoresDeEvento(eventoId, patrocinadores);
  }

  // devuelve la relacion patrocinador_evento
  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('evento/:id_evento')
  async getPatrocinadoresByEvento(@Param('id_evento') id_evento: string) {
    const eventoId = parseInt(id_evento, 10);
    if (isNaN(eventoId)) {
      throw new Error('El id_evento debe ser un número válido');
    }
    return this.patrocinadorService.getPatrocinadoresByEvento(eventoId);
  }

  // Crea un patrocinador
  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Post()
  create(@Body() data: CreatePatrocinadorDto) {
    return this.patrocinadorService.create(data);
  }

  // Obtiene todos los patrocinadores
  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Get()
  findAll() {
    return this.patrocinadorService.findAll();
  }

  // Obtiene un patrocinador
  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patrocinadorService.findOne(+id);
  }
  
  // Edita un patrocinador
  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdatePatrocinadorDto,
  ) {
    return this.patrocinadorService.update(+id, data);
  }

  // Elimina  un patrocinador
  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patrocinadorService.remove(+id);
  }


}
