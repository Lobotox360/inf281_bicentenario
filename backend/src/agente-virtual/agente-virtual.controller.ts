import { Controller, Post, Body } from '@nestjs/common';
import { AgenteVirtualService } from './agente-virtual.service';
import { PreguntaDto } from './dto/pregunta.dto';

@Controller('agente')
export class AgenteVirtualController {
  constructor(private readonly agenteVirtualService: AgenteVirtualService) {}

  @Post()
  async hacerPregunta(@Body() body: PreguntaDto) {
    const respuesta = await this.agenteVirtualService.preguntarAlAgente(body.pregunta);
    return { respuesta };
  }
}
