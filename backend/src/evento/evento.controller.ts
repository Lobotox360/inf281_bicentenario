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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EventoService } from './evento.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';
import { CasbinGuard } from 'src/rbac/casbin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('eventos')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  // se devuelve el link del evento
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('asistencia/evento/:id_evento')
  async getAsistenciaEvento(@Param('id_evento') id_evento: string) {
    const eventoId = parseInt(id_evento, 10);
    if (isNaN(eventoId)) {
      throw new HttpException(
        'El id_evento debe ser un número válido',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.eventoService.getAsistenciaEvento(eventoId);
  }

  // Inicia la reunion de un evento
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Put('iniciar-reunion/:id_evento')
  async iniciarReunion(@Param('id_evento') id_evento: string) {
    return this.eventoService.iniciarReunion(parseInt(id_evento, 10));
  }
  
  // Crea un nuevo evento
  @UseGuards(JwtAuthGuard, CasbinGuard)
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
  
    const categorias = typeof body.categoria === 'string'
      ? JSON.parse(body.categoria as any)
      : body.categoria;
  
    const patrocinadores = typeof body.patrocinador === 'string'
      ? JSON.parse(body.patrocinador as any)
      : body.patrocinador;
  
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
      categoria: categorias,
      patrocinador: patrocinadores,
    }, foto_evento);
  
    return eventoCreado;
  }
  

  // Obtiene todos los eventos
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get()
  async obtenerEventos() {
    return await this.eventoService.obtenerEventos();
  }

  // obtienen un evento
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get(':id')
  async obtenerEventoPorId(@Param('id') id: string) {
    const evento = await this.eventoService.obtenerEventoPorId(+id);
    return evento;
  }

  //Obtiene todos los eventos de un usuario
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('evento/usuario/:id')
  async obtenerEventosPorId(@Param('id') id: string) {
    return this.eventoService.obtenerEventosPorUsuario(id);
  }

  // Obtiene todos los eventos mas su ubicacion
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('calendario/evento')
  async obtenerTodosLosEventos() {
    return this.eventoService.obtenerTodosLosEventos();
  }
  
  
  // Edita datos de un evento
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Put(':id_evento')
  async updateEvento(
    @Param('id_evento') id_evento: string, 
    @Body() updateEventoDto: UpdateEventoDto 
  ) {
    const eventoId = parseInt(id_evento, 10);
    if (isNaN(eventoId)) {
      throw new Error('El id_evento debe ser un número válido');
    }
    return this.eventoService.updateEvento(eventoId, updateEventoDto);
  }
  
  // Edita la foto del evento
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Put('foto/:id_evento')
  @UseInterceptors(FileInterceptor('foto_evento'))
  async actualizarFotoEvento(
    @Param('id_evento') id_evento: string,
    @UploadedFile() foto_evento: Express.Multer.File
  ) {
    const eventoId = parseInt(id_evento, 10);
  
    if (isNaN(eventoId)) {
      throw new Error('El id_evento debe ser un número válido');
    }
    return this.eventoService.actualizarFotoEvento(eventoId, foto_evento);
  }
  
  // Elimina un evento
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Delete(':id')
  async eliminarEvento(@Param('id') id: number) {
    return await this.eventoService.eliminarEvento(+id);
  }


  //Obtiene una ubicacion
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('ubicacion/:id_evento')
  async getUbicacionByEvento(@Param('id_evento') id_evento: string) {
    const eventoId = parseInt(id_evento, 10);
    if (isNaN(eventoId)) {
        throw new HttpException(
        'El id_evento debe ser un número válido',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.eventoService.getUbicacionByEvento(eventoId);
  }

  // Edita la Ubicacion
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Put('ubicacion/:id_ubicacion')
  async updateUbicacion(
    @Param('id_ubicacion') id_ubicacion: string,
    @Body() updateUbicacionDto: any 
  ) {
    const ubicacionId = parseInt(id_ubicacion, 10);

    if (isNaN(ubicacionId)) {
      throw new HttpException(
        'El id_ubicacion debe ser un número válido',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.eventoService.updateUbicacion(ubicacionId, updateUbicacionDto);
  }

  @Get('top/10')
  async getTop10Eventos() {
    return this.eventoService.getTop10Eventos();
  }
}
