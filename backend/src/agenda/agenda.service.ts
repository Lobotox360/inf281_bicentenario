import { Injectable, NotFoundException,ConflictException} from '@nestjs/common';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { PrismaService } from 'src/prisma.service';
import * as uuid from 'uuid'; 
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

  let token = "ninguno";
  let qrUrl = "ninguno";
  if (evento.modalidad.toLowerCase() === 'hibrida' || evento.modalidad.toLowerCase() === 'presencial') {
    token = uuid.v4();
    // Generar el QR y subirlo a Cloudinary
    qrUrl = await this.emailService.generateQRCodeAndUpload(token);
    console.log("URL del QR generado:", qrUrl);
  }

  const actividad = `Evento: ${evento.titulo}`;
  const fechaCreacion = new Date();
  
  // Crear la agenda en la base de datos
  const nuevaAgenda = await this.prisma.agenda.create({
    data: {
      id_evento: data.id_evento,
      id_usuario: data.id_usuario,
      actividades: actividad,
      fecha: fechaCreacion,
      token: token,  // Guardar el token en la agenda
      qr_url: qrUrl, // Guardar la URL del QR en la agenda
    },
  });

function formatDateTime(dateString: string): { fecha: string; hora: string } {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
  const year = date.getFullYear();
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return {
    fecha: `${day}/${month}/${year}`,
    hora: `${hours}:${minutes}`,
  };
}


  console.log("Este es el token: " + token);
// Utilizando la nueva función formatDateTime
const { fecha: fechaInicio, hora: horaInicio } = formatDateTime(evento.hora_inicio);
const { fecha: fechaFin, hora: horaFin } = formatDateTime(evento.hora_fin);

  await this.emailService.sendInscripcionEventoEmail(usuario.email, {
    nombre_usuario: usuario.nombre,
    titulo: evento.titulo,
    descripcion: evento.descripcion,
    fecha_inicio: fechaInicio, // La fecha de inicio
    hora_inicio: horaInicio,   // La hora de inicio
    fecha_fin: fechaFin,       // La fecha de fin
    hora_fin: horaFin,         // La hora de fin
    modalidad: evento.modalidad,
    costo: `${evento.costo} Bs.`,
    ubicacion: evento.Ubicacion?.ubicacion || 'Ubicación no especificada',
    telefonos: evento.Telefonos?.map(t => ({
      nombre: t.nombre,
      numero: t.numero,
    })) || [],
    imagen_url: evento.foto_evento || 'https://res.cloudinary.com/djxsfzosx/image/upload/v1744514657/eventos/dlmsljwa7clnbrsobxdp.png',
    token: token,
    qr_url: qrUrl, // Enviar la URL del QR al correo
  });

  const resultadoLogro = await this.revisarLogro(data.id_usuario);

  return {
    mensaje: `✅ Felicidades, ${usuario.nombre}, te has registrado correctamente en el evento "${evento.titulo}".`,
    logro: resultadoLogro.logro,
    puntosExtra: resultadoLogro.puntosExtra,
    puntajeTotal: resultadoLogro.puntajeTotal,
    qr_url: qrUrl, // Retornar la URL del QR para verificar
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
  // Verificar que el usuario existe y obtener puntaje y cantidad de inscripciones
  const usuario = await this.prisma.usuarios.findUnique({
    where: {
      id_usuario,
    },
    select: {
      puntaje: true,
      Agenda: {
        select: {
          id_evento: true,
        },
      },
    },
  });

  if (!usuario) {
    throw new Error('❌ Usuario no encontrado');
  }

  const cantidadInscripciones = usuario.Agenda.length;
  const puntosExtra = this.calcularPuntosExtra(cantidadInscripciones);

  // Eliminar la agenda y actualizar el puntaje del usuario en una transacción
  await this.prisma.$transaction([
    this.prisma.agenda.delete({
      where: {
        id_usuario_id_evento: {
          id_usuario,
          id_evento,
        },
      },
    }),
    this.prisma.usuarios.update({
      where: {
        id_usuario,
      },
      data: {
        puntaje: Math.max(usuario.puntaje - (10 + puntosExtra), 0), // Asegurar que no sea negativo
      },
    }),
  ]);

  return {
    mensaje: `🗑️ Registro de agenda eliminado correctamente. Se restaron ${10 + puntosExtra} puntos.`,
  };
}

// Método auxiliar para calcular puntos extra basado en la cantidad de inscripciones
private calcularPuntosExtra(cantidadInscripciones: number): number {
  const logros = {
    1: 5,  // Bronce
    5: 10, // Plata
    10: 15, // Oro
    25: 20, // Platino
    50: 25, // Diamante
    100: 30, // Maestro
  };
  return logros[cantidadInscripciones] || 0;
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
