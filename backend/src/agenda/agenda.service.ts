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

  async registrarAsistencia(id_usuario: string, id_evento: number) {
    const evento = await this.prisma.eventos.findUnique({
      where: { id_evento },
      select: { reunion_iniciada: true, titulo: true, link_reunion: true },
    });
  
    if (!evento) {
      throw new NotFoundException('El evento no existe.');
    }
  
    if (!evento.reunion_iniciada) {
      throw new ConflictException(
        `La reunión para el evento "${evento.titulo}" aún no ha sido iniciada.`
      );
    }
  
    // Verificar si el usuario está inscrito en el evento
    const agenda = await this.prisma.agenda.findUnique({
      where: {
        id_usuario_id_evento: {
          id_usuario,
          id_evento,
        },
      },
    });
  
    if (!agenda) {
      throw new NotFoundException('No estás registrado en este evento.');
    }
  
    if (agenda.asistio) {
      throw new ConflictException('Ya registraste tu asistencia.');
    }
  
    // Registrar asistencia
    const actualizado = await this.prisma.agenda.update({
      where: {
        id_usuario_id_evento: { id_usuario, id_evento },
      },
      data: {
        asistio: true,
        hora_ingreso: new Date(),
      },
    });
  
    return {
      message: '✅ Asistencia registrada con éxito.',
      link: evento.link_reunion
    };
  }
  
  

  
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

    const actividad = `Evento: ${evento.titulo}`;
    const fechaCreacion = new Date();
  
    await this.prisma.agenda.create({
      data: {
        id_evento: data.id_evento,
        id_usuario: data.id_usuario,
        actividades: actividad,
        fecha: fechaCreacion,
      },
    });
  

    function formatTime(dateString: string): string {
      const date = new Date(dateString);
      const hours = String(date.getHours()).padStart(2, '0'); // Asegura que siempre tenga dos dígitos
      const minutes = String(date.getMinutes()).padStart(2, '0'); // Asegura que siempre tenga dos dígitos
      return `${hours}:${minutes}`;
    }

    await this.emailService.sendInscripcionEventoEmail(usuario.email, {
      nombre_usuario: usuario.nombre,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha.toISOString().split('T')[0],
      hora_inicio: formatTime(evento.hora_inicio),
      hora_fin: formatTime(evento.hora_fin),
      modalidad: evento.modalidad,
      costo: `${evento.costo} Bs.`,
      ubicacion: evento.Ubicacion?.ubicacion || 'Ubicación no especificada',
      telefonos: evento.Telefonos?.map(t => ({
        nombre: t.nombre,
        numero: t.numero,
      })) || [],
      imagen_url: evento.foto_evento || 'https://res.cloudinary.com/djxsfzosx/image/upload/v1744514657/eventos/dlmsljwa7clnbrsobxdp.png',
    });
  


    const resultadoLogro = await this.revisarLogro(data.id_usuario);

    return {
      mensaje: `✅ Felicidades, ${usuario.nombre}, te has registrado correctamente en el evento "${evento.titulo}".`,
      logro: resultadoLogro.logro,
      puntosExtra: resultadoLogro.puntosExtra,
      puntajeTotal: resultadoLogro.puntajeTotal,
    };
  }
  

  private async revisarLogro(id_usuario: string) {
    // Obtener al usuario y su rol
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id_usuario },
      include: {
        Roles: true,  // Usamos "Roles" en lugar de "rol"
      },
    });
  
    // Si no existe o no es usuario_casual, no hace nada
    if (!usuario || usuario.Roles.nombre !== 'usuario_casual') {
      return {
        logro: 'No aplica',
        puntosExtra: 0,
        puntajeTotal: usuario?.puntaje || 0,
      };
    }
  
    // Sumar puntos por participar
    await this.prisma.usuarios.update({
      where: {
        id_usuario,
      },
      data: {
        puntaje: {
          increment: 10,
        },
      },
    });
  
    const cantidadInscripciones = await this.prisma.agenda.count({
      where: { id_usuario },
    });
  
    let logro = 'Ninguno';
    let puntosExtra = 0;
  
    if (cantidadInscripciones === 1) {
      logro = 'Nivel Bronce';
      puntosExtra = 5;
    } else if (cantidadInscripciones === 5) {
      logro = 'Nivel Plata';
      puntosExtra = 10;
    } else if (cantidadInscripciones === 10) {
      logro = 'Nivel Oro';
      puntosExtra = 15;
    } else if (cantidadInscripciones === 25) {
      logro = 'Nivel Platino';
      puntosExtra = 20;
    } else if (cantidadInscripciones === 50) {
      logro = 'Nivel Diamante';
      puntosExtra = 25;
    } else if (cantidadInscripciones === 100) {
      logro = 'Nivel Maestro';
      puntosExtra = 30;
    }
  
    if (puntosExtra > 0) {
      await this.prisma.usuarios.update({
        where: { id_usuario },
        data: {
          puntaje: {
            increment: puntosExtra,
          },
        },
      });
    }
  
    const usuarioActualizado = await this.prisma.usuarios.findUnique({
      where: { id_usuario },
      select: {
        puntaje: true,
      },
    });
  
    return {
      logro,
      puntosExtra,
      puntajeTotal: usuarioActualizado?.puntaje || 0,
    };
  }
  
  
  
  
  

  async findByUsuario(id_usuario: string) {
    const agenda = await this.prisma.agenda.findMany({
      where: {
        id_usuario,
      },
      include: {
        Eventos: true, // Esto incluirá los eventos asociados a la agenda
      },
    });
  
    if (!agenda || agenda.length === 0) {
      throw new NotFoundException('No se encontraron registros de agenda para el usuario.');
    }
  
    return agenda;
  }
  
  async remove(id_usuario: string, id_evento: number) {
    // Eliminar la agenda
    await this.prisma.agenda.delete({
      where: {
        id_usuario_id_evento: {
          id_usuario,
          id_evento,
        },
      },
    });
  
    // Restar 10 puntos del usuario
    await this.prisma.usuarios.update({
      where: {
        id_usuario,
      },
      data: {
        puntaje: {
          decrement: 10,
        },
      },
    });
    
  
    return {
      mensaje: '🗑️ Registro de agenda eliminado correctamente. Puntos restados.',
    };
  }
  
  
  async addComentario(createAgendaDto: CreateAgendaDto) {
    const { id_usuario, id_evento, comentario } = createAgendaDto;

    if (comentario) {
      const existeAgenda = await this.prisma.agenda.findUnique({
        where: {
          id_usuario_id_evento: { id_usuario, id_evento },
        },
      });

      if (!existeAgenda) {
        throw new Error('Agenda no encontrada para este evento y usuario.');
      }

      await this.prisma.agenda.update({
        where: {
          id_usuario_id_evento: { id_usuario, id_evento },
        },
        data: {
          comentario,
        },
      });
      return { message: 'Comentario agregado correctamente.' };
    } else {
      throw new Error('Comentario no proporcionado.');
    }
  }
  async addCalificacion(createAgendaDto: CreateAgendaDto) {
    const { id_usuario, id_evento, calificacion } = createAgendaDto;
  
    // Validar la calificación
    if (calificacion !== undefined && (calificacion < 1 || calificacion > 5)) {
      throw new Error('La calificación debe estar entre 1 y 5.');
    }
  
    // Verificar si la agenda existe para el usuario y evento
    const existeAgenda = await this.prisma.agenda.findUnique({
      where: {
        id_usuario_id_evento: { id_usuario, id_evento },
      },
    });
  
    if (!existeAgenda) {
      throw new Error('Agenda no encontrada para este evento y usuario.');
    }
  
    // Actualizar la calificación en la agenda
    await this.prisma.agenda.update({
      where: {
        id_usuario_id_evento: { id_usuario, id_evento },
      },
      data: {
        calificacion,
      },
    });
  
    // Calcular el promedio de calificaciones del evento
    const calificaciones = await this.prisma.agenda.findMany({
      where: {
        id_evento,
        calificacion: { gte: 1 },  // Solo contar calificaciones válidas
      },
      select: { calificacion: true },
    });
  
    // Filtrar las calificaciones nulas, undefined y -1
    const calificacionesValidas = calificaciones.filter(c => c.calificacion !== null && c.calificacion !== undefined && c.calificacion !== -1);
  
    // Verificar si hay calificaciones válidas antes de calcular el promedio
    if (calificacionesValidas.length === 0) {
      throw new Error('No hay calificaciones válidas para este evento.');
    }
  
    const promedio = calificacionesValidas.reduce((acc, { calificacion }) => acc + (calificacion || 0), 0) / calificacionesValidas.length;

    // Actualizar el campo "puntuacion" en el evento con el promedio calculado
    await this.prisma.eventos.update({
      where: { id_evento },
      data: {
        puntuacion: promedio,
      },
    });
  
    return { message: 'Calificación agregada correctamente y puntuación actualizada.' };
  }
  
  async getComentariosDeEvento(id_evento: number) {
    // Obtener todas las agendas asociadas a este evento
    const agenda = await this.prisma.agenda.findMany({
      where: { id_evento },
      include: {
        Usuarios: {
          select: {
            nombre: true,  // Seleccionamos el nombre del usuario
            foto: true,
          },
        },
      },
    });

    // Verificamos si existen agendas (comentarios) para el evento
    if (!agenda || agenda.length === 0) {
      throw new NotFoundException('No se encontraron comentarios para este evento.');
    }

    // Mapear los comentarios con el nombre del usuario
    const comentariosConNombres = agenda.map((item) => ({
      comentario: item.comentario,
      nombre_usuario: item.Usuarios.nombre,
      foto_usuario: item.Usuarios.foto,
      calificacion: item.calificacion,
    }));

    return comentariosConNombres;
  }   
  
}
