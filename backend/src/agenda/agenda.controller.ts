import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe} from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { CasbinGuard } from 'src/rbac/casbin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('agenda')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}
  
  @Post()
  create(@Body() data: CreateAgendaDto) {
    return this.agendaService.create(data);
  }

  @Get(':id_usuario')
  findOne(
    @Param('id_usuario') id_usuario: string,
  ) {
    return this.agendaService.findByUsuario(id_usuario);
  }

  @Delete(':id_usuario/:id_evento')
  remove(
    @Param('id_usuario') id_usuario: string,
    @Param('id_evento', ParseIntPipe) id_evento: number,
  ) {
    return this.agendaService.remove(id_usuario, id_evento);
  }

  
  /*
  @Get()
  findAll() {
    return this.agendaService.findAll();
  }

  @Put(':id_usuario/:id_evento')
  update(
    @Param('id_usuario') id_usuario: string,
    @Param('id_evento', ParseIntPipe) id_evento: number,
    @Body() data: UpdateAgendaDto,
  ) {
    return this.agendaService.update(id_usuario, id_evento, data);
  }
  */
}
