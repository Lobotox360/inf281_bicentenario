import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PuntuacionService } from './puntuacion.service';

@Controller('puntuacion')
export class PuntuacionController {
  constructor(private readonly puntuacionService: PuntuacionService) {}

  @Get('top/:limit')
  async getTopUsuarios(@Param('limit') limit: string) {
    const limitAsNumber = parseInt(limit, 10);
    return this.puntuacionService.getTopUsuarios(limitAsNumber);
  }

  @Get('usuario/:id_usuario')
  async getUsuarioData(@Param('id_usuario') id_usuario: string) {
    return this.puntuacionService.getUsuarioData(id_usuario);
  }
}
