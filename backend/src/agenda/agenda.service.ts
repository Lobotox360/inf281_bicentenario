import { Injectable, NotFoundException,ConflictException} from '@nestjs/common';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { PrismaService } from 'src/prisma.service';
import { EmailService } from './email.service';

@Injectable()
export class AgendaService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  
  async create(data: CreateAgendaDto) {
    const evento = await this.prisma.eventos.findUnique({
      where: { id_evento: data.id_evento },
      include: {
        Ubicacion: true,
        Telefonos: true,
        Eventos_Patrocinadores: {
          include: {
            Patrocinadores: true,
          },
        },
      },
    });
  
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id_usuario: data.id_usuario },
    });
  
    if (!usuario || !evento) {
      throw new NotFoundException('❌ Los datos del ID de evento o del participante son incorrectos.');
    }
  
    const yaInscrito = await this.prisma.agenda.findUnique({
      where: {
        id_usuario_id_evento: {
          id_usuario: data.id_usuario,
          id_evento: data.id_evento,
        },
      },
    });
  
    if (yaInscrito) {
      throw new ConflictException('⚠️ Ya estás inscrito en este evento.');
    }
  
    await this.prisma.agenda.create({ data });
  
    await this.emailService.sendInscripcionEventoEmail(usuario.email, {
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha.toISOString().split('T')[0],
      hora_inicio: evento.hora_inicio,
      hora_fin: evento.hora_fin,
      modalidad: evento.modalidad,
      costo: `${evento.costo} Bs.`,
      ubicacion: evento.Ubicacion?.ubicacion || 'Ubicación no especificada',
      telefonos: evento.Telefonos?.map(t => ({
        nombre: t.nombre,
        numero: t.numero,
      })) || [],
      imagen_url: evento.foto_evento || 'https://res.cloudinary.com/djxsfzosx/image/upload/v1744514657/eventos/dlmsljwa7clnbrsobxdp.png',
    });
  
    return {
      mensaje: '✅ Registro en la agenda creado exitosamente.',
    };
  }
  
  

  async findByUsuario(id_usuario: string) {
    const agenda = await this.prisma.agenda.findMany({
      where: {
        id_usuario,
      },
    });
  
    if (!agenda || agenda.length === 0) {
      throw new NotFoundException('No se encontraron registros de agenda para el usuario.');
    }
  
    return agenda;
  }
  
  async remove(id_usuario: string, id_evento: number) {
    await this.prisma.agenda.delete({
      where: {
        id_usuario_id_evento: {
          id_usuario,
          id_evento,
        },
      },
    });
  
    return {
      mensaje: '🗑️ Registro de agenda eliminado correctamente.',
    };
  }
  
  /*
  findAll() {
    return this.prisma.agenda.findMany({
      include: {
        Usuarios: true,
        Eventos: true,
      },
    });
  }



  update(id_usuario: string, id_evento: number, data: UpdateAgendaDto) {
    return this.prisma.agenda.update({
      where: {
        id_usuario_id_evento: {
          id_usuario,
          id_evento,
        },
      },
      data,
    });
  }


  */
}
