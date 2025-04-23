import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';
import { EmailService } from './email.service';

@Injectable()
export class EventoService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    private emailService: EmailService,
  ) {}

  async notificarInicioReunion(id_evento: number) {
    const evento = await this.prisma.eventos.findUnique({
      where: { id_evento },
      include: {
        Agenda: {
          include: {
            Usuarios: true, // obtener el correo y nombre
          },
        },
      },
    });
  
    if (!evento || !evento.reunion_iniciada) {
      throw new BadRequestException('No se ha iniciado la reunión.');
    }
  
    for (const agenda of evento.Agenda) {
      const usuario = agenda.Usuarios;
      await this.emailService.sendReunionIniciadaEmail(usuario.email, {
        nombre_usuario: usuario.nombre,
        titulo: evento.titulo,
        link_reunion: evento.link_reunion!,
      });
    }
  
    return {
      message: '📬 Correos enviados a los participantes del evento.',
    };
  }

  
  async iniciarReunion(id_evento: number) {
    const evento = await this.prisma.eventos.findUnique({
      where: { id_evento },
    });
  
    if (!evento) {
      throw new NotFoundException('Evento no encontrado.');
    }
  
    // Convertimos hora_inicio y hora_fin a objetos Date
    const ahora = new Date();
    const horaInicio = new Date(evento.hora_inicio);
    const horaFin = new Date(evento.hora_fin);

    /*
    // Validamos si estamos dentro del rango permitido
    if (ahora < horaInicio || ahora > horaFin) {
      throw new ForbiddenException('⏳ La reunión solo puede iniciarse en el horario del evento.');
    }

    */
    const actualizado = await this.prisma.eventos.update({
      where: { id_evento },
      data: {
        reunion_iniciada: true,
      },
    });
  
    // 🔔 Enviar correos a los inscritos
    await this.notificarInicioReunion(id_evento);
  
    return {
      message: '✅ Reunión iniciada correctamente y notificaciones enviadas.',
      link: actualizado.link_reunion,
    };
  }
  

  async getTop10Eventos() {
    const eventos = await this.prisma.eventos.findMany({
      orderBy: {
        puntuacion: 'desc', // Ordenar por puntuación en orden descendente
      },
      take: 10, // Limitar a los primeros 10 eventos
    });

    return eventos;
  }
  async getUbicacionByEvento(id_evento: number) {
    const ubicacion = await this.prisma.ubicacion.findUnique({
      where: {
        id_evento: id_evento,
      },
    });

    if (!ubicacion) {
      return { message: 'Ubicación no encontrada para este evento.' };
    }
    return { ubicacion };
  }

  async updateUbicacion(id_ubicacion: number, updateUbicacionDto: any) {
    const ubicacionExistente = await this.prisma.ubicacion.findUnique({
      where: { id_ubicacion: id_ubicacion },
    });

    if (!ubicacionExistente) {
      return {
        message: 'La ubicación con el id_ubicacion proporcionado no fue encontrada.',
      };
    }

    const updatedUbicacion = await this.prisma.ubicacion.update({
      where: {
        id_ubicacion: id_ubicacion,
      },
      data: updateUbicacionDto,
    });

    return {
      message: 'Ubicación actualizada con éxito.'
    };
  }


  async subirFoto(file: Express.Multer.File) {
    return await this.cloudinaryService.uploadImage(file, 'eventos');
  }

  async procesarYCrearEvento(body: any, foto_evento: Express.Multer.File) {
    const {
      titulo,
      descripcion,
      hora_inicio,
      hora_fin,
      costo,
      modalidad,
      categoria,
      patrocinador,
      telefonos_contacto,
      expositor,
      ubicacion,
    } = body;

    const url = body.foto_evento;


    const evento = await this.prisma.eventos.create({
      data: {
        titulo,
        descripcion,
        hora_inicio,
        hora_fin,
        fecha: new Date(),
        costo: parseFloat(costo),
        modalidad,
        foto_evento: url,
        link_reunion: `https://meet.jit.si/${titulo.replace(/\s+/g, '-')}-${Date.now()}`,
        reunion_iniciada: false,       
      },
    });

    const id_evento = evento.id_evento;


    
    // Guardar expositores
    if (Array.isArray(expositor)) {
      const expositoresFormateados = expositor.map((exp) => ({
        id_evento,
        ...exp,
      }));
    
      await this.prisma.expositores.createMany({
        data: expositoresFormateados,
      });
    }
    
    // Guardar Telefonos
    if (Array.isArray(telefonos_contacto)) {
      const telefonosFormateados = telefonos_contacto.map((tel, index) => ({
        id_evento,
        nombre: `Teléfono ${index + 1}`,
        numero: tel.telefono,
      }));
    
      await this.prisma.telefonos.createMany({
        data: telefonosFormateados,
      });
    }

    if (ubicacion) {
      await this.prisma.ubicacion.create({
        data: {
          id_evento,
          ...ubicacion,
        },
      });
    }   

  for (const cat of categoria) {
    await this.prisma.eventos_Categorias.create({
      data: {
        id_evento: evento.id_evento,
        id_categoria: cat.id_categoria,
      },
    });
  }

  // Crear los patrocinadores asociados al evento
  for (const patro of patrocinador) {
    await this.prisma.eventos_Patrocinadores.create({
      data: {
        id_evento: evento.id_evento,
        id_auspiciador: patro.id_auspiciador,
      },
    });
  }
    return { mensaje: '✅ Evento creado correctamente' };
  }

  async obtenerEventos() {
    const eventos = await this.prisma.eventos.findMany({
      include: {
        Telefonos: true,
        CategoriasEvento: { include: { categoria: true } },
        Expositores: true,
        Ubicacion: true,
        Eventos_Patrocinadores: { include: { Patrocinadores: true } }
      },
    });
  
    const ahora = new Date();
  
    return eventos.map(evento => {
      const inicio = new Date(evento.hora_inicio);
      const fin = new Date(evento.hora_fin);
  
      let estado = '';
      if (ahora < inicio) {
        estado = 'Próximo';
      } else if (ahora > fin) {
        estado = 'Finalizado';
      } else {
        estado = 'En curso';
      }
  
      return {
        ...evento,
        estado,
      };
    });
  }
  
  async eliminarEvento(id: number) {
    const eventoExistente = await this.prisma.eventos.findUnique({
      where: { id_evento: id },
    });
  
    if (!eventoExistente) {
      return { mensaje: `❌ El evento con ID ${id} no existe.` };
    }
  
    await this.prisma.eventos.delete({
      where: { id_evento: id },
    });
  
    return { mensaje: `🗑️ Evento con ID ${id} eliminado correctamente.` };
  }

  
  
  async obtenerEventoPorId(id: number) {
    const evento = await this.prisma.eventos.findUnique({
      where: { id_evento: id },
      include: {
        Telefonos: true,
        CategoriasEvento: { include: { categoria: true } },
        Expositores: true,
        Ubicacion: true,
        Eventos_Patrocinadores: { include: { Patrocinadores: true } },
      },
    });
  
    if (!evento) {
      return { mensaje: `❌ No se encontró el evento con ID ${id}` };
    }
  
    const ahora = new Date();
    const inicio = new Date(evento.hora_inicio);
    const fin = new Date(evento.hora_fin);
  
    let estado = '';
    if (ahora < inicio) {
      estado = 'Próximo';
    } else if (ahora > fin) {
      estado = 'Finalizado';
    } else {
      estado = 'En curso';
    }
  
    return { ...evento, estado };
  }

  async updateEvento(id_evento: number, updateEventoDto: UpdateEventoDto) {
    const now = new Date().toISOString();
  
    const updatedEvento = await this.prisma.eventos.update({
      where: { id_evento: id_evento },
      data: {
        ...updateEventoDto,
        fecha: now,
      },
    });
  
    return { mensaje: '✅ Evento actualizado correctamente'};
  }

  async actualizarFotoEvento(id_evento: number, foto_evento: Express.Multer.File) {
    const subida = await this.subirFoto(foto_evento);
    const url = subida.secure_url;
  
    const eventoId = parseInt(id_evento.toString(), 10); 
  
    if (isNaN(eventoId)) {
      throw new Error('El id_evento debe ser un número válido');
    }
  
    const eventoActualizado = await this.prisma.eventos.update({
      where: {
        id_evento: eventoId,
      },
      data: {
        foto_evento: url,
      },
    });
  
    return { mensaje: '✅ Foto actualizado correctamente'};
  }
  
  async obtenerEventosPorUsuario(id_usuario: string) {
    const eventos = await this.prisma.agenda.findMany({
      where: {
        id_usuario: id_usuario,
      },
      include: {
        Eventos: {
          select: {
            id_evento: true,
            titulo: true,
            descripcion: true,
            fecha: true,
            hora_inicio: true,
            hora_fin: true,
            modalidad: true,
            puntuacion: true,
            link_reunion: true,
            reunion_iniciada: true,
            foto_evento: true,
            Ubicacion: {  // Incluimos la ubicación solo una vez aquí
              select: {
                ubicacion: true,
                departamento: true,
                latitud: true,
                longitud: true,
              },
            },
          },
        },
      },
    });
  
    if (!eventos || eventos.length === 0) {
      throw new Error('No se encontraron eventos para este usuario.');
    }
  
    // Mapeamos los eventos, y dentro de cada evento, asignamos la ubicación solo una vez
    return eventos.map((agenda) => {
      const evento = agenda.Eventos;
      return {
        ...evento
      };
    });
  }
  
  
  async obtenerTodosLosEventos() {
    const eventos = await this.prisma.eventos.findMany({
      include: {
        Ubicacion: {
          select: {
            ubicacion: true,
            departamento: true,
            latitud: true,
            longitud: true,
          },
        },
      },
    });
  
    if (!eventos || eventos.length === 0) {
      throw new Error('No se encontraron eventos.');
    }
  
    // Asegurarse de que la ubicación solo se incluya una vez en el evento
    return eventos.map((evento) => ({
      id_evento: evento.id_evento,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha,
      hora_inicio: evento.hora_inicio,
      hora_fin: evento.hora_fin,
      modalidad: evento.modalidad,
      puntuacion: evento.puntuacion,
      link_reunion: evento.link_reunion,
      reunion_iniciada: evento.reunion_iniciada,
      foto_evento: evento.foto_evento,
      ubicacion: evento.Ubicacion, // Incluir ubicación solo una vez
    }));
  }
  
}
