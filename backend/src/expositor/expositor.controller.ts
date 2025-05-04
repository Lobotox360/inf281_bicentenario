import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { ExpositorService } from './expositor.service';
import { CreateExpositoresDto } from './dto/create-expositores.dto';
import { UpdateExpositorDto } from './dto/update-expositor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CasbinGuard } from '../rbac/casbin.guard';

@Controller('expositor')
export class ExpositorController {
  constructor(private readonly expositorService: ExpositorService) {}
  
  // Edita todos los expositores de un evento
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Put(':id_evento')
  async updateExpositores(
    @Param('id_evento') id_evento: string,
    @Body() createExpositoresDto: CreateExpositoresDto,  // Recibimos el DTO con el array de expositores
  ) {
    const eventoId = parseInt(id_evento, 10);
    if (isNaN(eventoId)) {
      throw new Error('El id_evento debe ser un número válido');
    }

    return this.expositorService.updateExpositoresDeEvento(eventoId, createExpositoresDto.expositores);
  }

  // Proporciona todos los expositores de un evento
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get(':id')
  findAllByEvent(@Param('id') id: string) {
    return this.expositorService.findAllByEvent(+id);
  }
  
}
