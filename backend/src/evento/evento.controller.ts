import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { EventoService } from './evento.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CasbinGuard } from 'src/rbac/casbin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('evento')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}
  //@UseGuards(CasbinGuard,JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('foto_evento'))
  async crearEvento(
    @UploadedFile() foto_evento: Express.Multer.File,
    @Body() body: CreateEventoDto
  ) {
    const contacto = typeof body.telefonos_contacto === 'string'
      ? JSON.parse(body.telefonos_contacto as any)
      : body.telefonos_contacto;

    const expositores = typeof body.expositor === 'string'
      ? JSON.parse(body.expositor as any)
      : body.expositor;

    const ubicacion = typeof body.ubicacion === 'string'
      ? JSON.parse(body.ubicacion as any)
      : body.ubicacion;

    let url = '';
    if (foto_evento) {
      const subida = await this.eventoService.subirFoto(foto_evento);
      url = subida.secure_url;
    }

    const eventoCreado = await this.eventoService.procesarYCrearEvento({
      ...body,
      foto_evento: url,
      telefonos_contacto: contacto,
      expositor: expositores,
      ubicacion,
    }, foto_evento);

    return eventoCreado;
  }

  //@UseGuards(CasbinGuard,JwtAuthGuard)
  @Get()
  async obtenerEventos() {
    return await this.eventoService.obtenerEventos();
  }
}
