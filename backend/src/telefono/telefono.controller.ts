import { Controller, Get, Post, Body, Put , Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { TelefonoService } from './telefono.service';
import { CreateTelefonosDto } from './dto/create-telefonos.dto';
import { UpdateTelefonoDto } from './dto/update-telefono.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CasbinGuard } from '../rbac/casbin.guard';

@Controller('telefono')
export class TelefonoController {
  constructor(private readonly telefonoService: TelefonoService) {}

  // Agrega telefonos y elimina eventos que ya no se tiene
  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Put(':id_evento')
  async updateTelefonosEvento(
    @Param('id_evento') id_evento: string,  // Recibimos el id_evento
    @Body() telefonos_contacto: { telefono: string }[] // Recibimos el array con los teléfonos
  ) {
    const eventoId = parseInt(id_evento, 10);
  
    if (isNaN(eventoId)) {
      throw new HttpException(
        'El id_evento debe ser un número válido',
        HttpStatus.BAD_REQUEST,
      );
    }
  
    return this.telefonoService.updateTelefonosDeEvento(eventoId, telefonos_contacto);
  }
  
  // Obtiene todos los telefonos de un evento
  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Get(':id_evento')
  async findAllByEvent(@Param('id_evento') id_evento: string) {
    return this.telefonoService.findAllByEvent(+id_evento); // Llamar con `id_evento`
  }
  
}
