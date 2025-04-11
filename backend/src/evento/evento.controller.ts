import { Controller, Get, Post, Body, UploadedFile, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { EventoService } from './evento.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('evento')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}


  @Get('categoria')
  getCategorias() {
    return this.eventoService.getCategorias();
  }

  @Get('patrocinador')
  getPatrocinadores() {
    return this.eventoService.getPatrocinadores();
  }

  @Post()
  @UseInterceptors(FileInterceptor('foto_evento'))
  async crearEvento(
    @UploadedFile() foto_evento: Express.Multer.File,
    @Body() body: CreateEventoDto,
  ) {
    const telefonos_contacto = typeof body.telefonos_contacto === 'string'
      ? JSON.parse(body.telefonos_contacto)
      : body.telefonos_contacto;
  
    const expositor = typeof body.expositor === 'string'
      ? JSON.parse(body.expositor)
      : body.expositor;
  
    const evento = await this.eventoService.procesarYCrearEvento(
      { ...body, telefonos_contacto, expositor },
      foto_evento
    );
  
    return evento;
  }
  @Get()
  async obtenerEventos() {
    return await this.eventoService.obtenerEventos();
  }
}
