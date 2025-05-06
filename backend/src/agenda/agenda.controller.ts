import { Controller, BadRequestException, Get, Post, Body, Put, Param, Delete, ParseIntPipe,UseGuards} from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { CasbinGuard } from 'src/rbac/casbin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('agenda')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}


  // Crea la asistencia al evento
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post('asistencia')
  async registrarAsistencia(@Body() dto: CreateAsistenciaDto) {
    return this.agendaService.registrarAsistencia(dto.id_usuario, dto.id_evento);
  }
  
  

  // Se agenda a un evento
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post()
  create(@Body() data: CreateAgendaDto) {
    return this.agendaService.create(data);
  }

  // Obtiene la agenda de un usuario
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get(':id_usuario')
  findOne(
    @Param('id_usuario') id_usuario: string,
  ) {
    return this.agendaService.findByUsuario(id_usuario);
  }

  //Elimina una agenda
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Delete(':id_usuario/:id_evento')
  remove(
    @Param('id_usuario') id_usuario: string,
    @Param('id_evento', ParseIntPipe) id_evento: number,
  ) {
    return this.agendaService.remove(id_usuario, id_evento);
  }

  //Agrega un comentario
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post('comentario')
  async addComentario(@Body() createAgendaDto: CreateAgendaDto) {
    return this.agendaService.addComentario(createAgendaDto);
  }

  //Agrega una calificacion
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post('calificacion')
  async addCalificacion(@Body() createAgendaDto: CreateAgendaDto) {
    return this.agendaService.addCalificacion(createAgendaDto);
  }

  //Obtiene los comentarios de un evento
  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('comentarios/:id_evento')
  async getComentarios(@Param('id_evento', ParseIntPipe) id_evento: number) {
    return this.agendaService.getComentariosDeEvento(id_evento);
  }
}
