import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { EventoService } from './evento.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CasbinGuard } from 'src/rbac/casbin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('evento')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  
  //@UseGuards(JwtAuthGuard, CasbinGuard)
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

    let url = 'https://res.cloudinary.com/djxsfzosx/image/upload/v1744514657/eventos/dlmsljwa7clnbrsobxdp.png';
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

  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Get()
  async obtenerEventos() {
    return await this.eventoService.obtenerEventos();
  }

  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Get(':id')
  async obtenerEventoPorId(@Param('id') id: string) {
    const evento = await this.eventoService.obtenerEventoPorId(+id);
    return evento;
  }

  
  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('foto_evento'))
  async actualizarEvento(
    @Param('id') id: string,
    @UploadedFile() nuevaFoto: Express.Multer.File,
    @Body() body: any
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

    const eventoActualizado = await this.eventoService.actualizarEvento(+id, {
      ...body,
      telefonos_contacto: contacto,
      expositor: expositores,
      ubicacion,
    }, nuevaFoto);

    return eventoActualizado;
  }

  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Delete(':id')
  async eliminarEvento(@Param('id') id: number) {
    return await this.eventoService.eliminarEvento(+id);
  }
}
